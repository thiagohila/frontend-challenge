import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { addToCart, expect, test } from './fixtures'

async function expectNoSeriousViolations(page: Page) {
  await page.waitForLoadState('networkidle')
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const blocking = violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
  expect(blocking.map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length})`)).toEqual([])
}

for (const path of [
  '/',
  '/?collection=%5B%22arte-digital%22%5D&sort=price-asc',
  '/nft/emerald-ape-042',
  '/nft/nao-existe',
  '/rota-inexistente',
  '/login',
  '/register',
]) {
  test(`no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path)
    await expectNoSeriousViolations(page)
  })
}

test('no serious a11y violations on /cart (with items and coupon error)', async ({ page }) => {
  await page.goto('/nft/emerald-ape-042')
  await page.getByRole('button', { name: /^(COMPRAR|Comprar NFT)$/ }).click()
  await expect(page.getByTestId('cart-total')).toBeVisible()
  await page.getByRole('textbox', { name: 'Código promocional' }).fill('XYZ')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByRole('textbox', { name: 'Código promocional' })).toHaveAttribute('aria-invalid', 'true')
  await expectNoSeriousViolations(page)
})

test('no serious a11y violations on /checkout, the review dialog and the receipt', async ({ page, loginAs }) => {
  test.setTimeout(60_000) // full purchase + 3 axe runs; slow under parallel load
  await page.goto('/')
  await loginAs('ana')
  await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
  await page.goto('/checkout')
  await expect(page.getByTestId('checkout-total')).toBeVisible()
  await expectNoSeriousViolations(page)

  await page.getByRole('button', { name: 'Conectar carteira' }).click()
  await expect(page.getByTestId('wallet-status')).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  const review = page.getByRole('dialog', { name: 'Revise seu pedido' })
  await expect(review).toBeVisible()
  await expectNoSeriousViolations(page)

  await review.getByRole('button', { name: 'Enviar pedido' }).click()
  await expect(page.getByTestId('order-confirmed')).toBeVisible({ timeout: 15_000 })
  await expectNoSeriousViolations(page)
})

test('no serious a11y violations on /account/profile with errors', async ({ page, loginAs }) => {
  await page.goto('/account/profile')
  await loginAs('ana')
  await page.getByLabel('Nova senha', { exact: true }).fill('x')
  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByLabel('Senha atual')).toHaveAttribute('aria-invalid', 'true')
  await expectNoSeriousViolations(page)
})

test('no serious a11y violations on /favorites (signed in)', async ({ page, loginAs }) => {
  await page.goto('/favorites')
  await loginAs('ana')
  await expect(page.getByRole('heading', { name: 'Favoritos' })).toBeVisible()
  await expectNoSeriousViolations(page)
})

test('no serious a11y violations on /account/wallets (signed in)', async ({ page, loginAs }) => {
  await page.goto('/account/wallets')
  await loginAs('ana')
  await page.getByRole('button', { name: 'Editar' }).first().click()
  await expectNoSeriousViolations(page)
})
