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

/** Adds items as the current owner (guest or signed-in user) through the REST API — same contract as the UI. */
export async function addToCart(page: Page, items: [nftId: string, editionId: string, quantity: number][]) {
  await waitForMockServer(page)
  await page.waitForFunction(() => localStorage.getItem('kurio:guest-cart') ?? sessionStorage.getItem('kurio:session'))
  await page.evaluate(async (lines) => {
    const session = JSON.parse(sessionStorage.getItem('kurio:session') ?? 'null') as { token: string } | null
    const guest = JSON.parse(localStorage.getItem('kurio:guest-cart') ?? 'null') as string | null
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (session) headers.Authorization = `Bearer ${session.token}`
    else if (guest) headers['X-Guest-Cart-Id'] = guest
    for (const [nftId, editionId, quantity] of lines) {
      const response = await fetch('/api/cart/items', { method: 'POST', headers, body: JSON.stringify({ nftId, editionId, quantity }) })
      if (!response.ok) throw new Error(`addToCart failed: ${response.status}`)
    }
  }, items)
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
