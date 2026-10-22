import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

async function expectNoSeriousViolations(page: Page) {
  await page.waitForLoadState('networkidle')
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const blocking = violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
  expect(blocking.map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length})`)).toEqual([])
}

for (const path of ['/', '/rota-inexistente', '/login', '/register']) {
  test(`no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path)
    await expectNoSeriousViolations(page)
  })
}

test('no serious a11y violations on /account/wallets (signed in)', async ({ page, loginAs }) => {
  await page.goto('/account/wallets')
  await loginAs('ana')
  await page.getByRole('button', { name: 'Editar' }).first().click()
  await expectNoSeriousViolations(page)
})
