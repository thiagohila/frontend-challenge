import { addToCart, expect, test } from './fixtures'

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

test('no horizontal overflow on the cart with items', async ({ page }) => {
  await page.goto('/nft/emerald-ape-042')
  await page.getByRole('button', { name: /^(COMPRAR|Comprar NFT)$/ }).click()
  await expect(page.getByTestId('cart-total')).toBeVisible()
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth, window.innerWidth])
  expect(widths[0]).toBeLessThanOrEqual(widths[1] ?? 0)
  expect(widths[2]).toBe(widths[1])
})

test('no horizontal overflow on checkout', async ({ page, loginAs }) => {
  await page.goto('/')
  await loginAs('ana')
  await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
  await page.goto('/checkout')
  await expect(page.getByTestId('checkout-total')).toBeVisible()
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth, window.innerWidth])
  expect(widths[0]).toBeLessThanOrEqual(widths[1] ?? 0)
  expect(widths[2]).toBe(widths[1])
})

test('no horizontal overflow on the signed-in account area', async ({ page, loginAs }) => {
  await page.goto('/account/wallets')
  await loginAs('ana')
  await page.getByRole('button', { name: 'Editar' }).first().click()
  for (const path of ['/account/wallets', '/account/profile']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const [scroll, client] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
    expect(scroll, path).toBeLessThanOrEqual(client ?? 0)
  }
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
  expect(widths[0]).toBeLessThanOrEqual(widths[1] ?? 0)
})
