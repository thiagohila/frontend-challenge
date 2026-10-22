import { expect, test } from './fixtures'

// No horizontal overflow (U10). At 390px this also covers 400% zoom of a 1280px window (WCAG 1.4.10).
for (const path of ['/', '/nft/emerald-ape-042', '/login', '/register', '/rota-inexistente']) {
  test(`no horizontal overflow on ${path}`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const { scrollWidth, clientWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      innerWidth: window.innerWidth,
    }))
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    // A wider layout viewport means the mobile browser zoomed out to fit overflowing content.
    expect(innerWidth).toBe(clientWidth)
  })
}

test('no horizontal overflow on the signed-in account area', async ({ page, loginAs }) => {
  await page.goto('/account/wallets')
  await loginAs('ana')
  await page.getByRole('button', { name: 'Editar' }).first().click()
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
  expect(widths[0]).toBeLessThanOrEqual(widths[1] ?? 0)
})
