import { test as base, expect, type Page } from '@playwright/test'
import type { MockControl } from '../src/mocks/control'
import type { ScenarioName } from '../src/mocks/scenarios'
import { DEMO_PASSWORD, DEMO_USERS } from '../src/mocks/server/seed'

type DemoUser = keyof typeof DEMO_USERS
type ControlMethod = { [K in keyof MockControl]: MockControl[K] extends (...args: never[]) => unknown ? K : never }[keyof MockControl]
type MockProxy = { [K in ControlMethod]: (...args: Parameters<MockControl[K]>) => Promise<Awaited<ReturnType<MockControl[K]>>> }

interface Fixtures {
  /** Scenario applied on the first load of each test (isolated per context; survives reloads). */
  scenario: ScenarioName
  /** Proxy to `window.__mock` — the simulated server's admin API (ARCHITECTURE §10). */
  mock: MockProxy
  /** Signs in through the REST API (UI login is covered by auth.spec). */
  loginAs: (user: DemoUser) => Promise<void>
}

export async function waitForMockServer(page: Page) {
  await page.waitForFunction(() => Boolean(window.__mock))
}

export const test = base.extend<Fixtures>({
  scenario: ['default', { option: true }],

  page: async ({ page, scenario }, use) => {
    // Runs before app scripts on every navigation; configures the mock only once (C6).
    await page.addInitScript((name) => {
      if (sessionStorage.getItem('mock:init')) return
      sessionStorage.setItem('mock:init', '1')
      sessionStorage.setItem('msw-server-runtime', JSON.stringify({ scenario: name, latency: null, failures: [], consumedFlags: [] }))
    }, scenario)
    await use(page)
  },

  mock: async ({ page }, use) => {
    const proxy = new Proxy({} as MockProxy, {
      get:
        (_target, method: string) =>
        async (...args: unknown[]) => {
          await waitForMockServer(page)
          return page.evaluate(
            ([name, params]) => {
              const control = window.__mock as unknown as Record<string, (...input: unknown[]) => unknown>
              const fn = control[name]
              if (!fn) throw new Error(`unknown mock control: ${name}`)
              return fn(...params)
            },
            [method, args] as const,
          )
        },
    })
    await use(proxy)
  },

  loginAs: async ({ page }, use) => {
    await use(async (user) => {
      await waitForMockServer(page)
      const session = await page.evaluate(
        async ({ email, password }) => {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          if (!response.ok) throw new Error(`login failed: ${response.status}`)
          return response.json() as Promise<unknown>
        },
        { email: DEMO_USERS[user].email, password: DEMO_PASSWORD },
      )
      await page.evaluate((value) => sessionStorage.setItem('kurio:session', JSON.stringify(value)), session)
      await page.reload()
    })
  },
})

export { expect }
