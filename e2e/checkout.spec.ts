import type { Page } from '@playwright/test'
import { DEMO_PASSWORD } from '../src/mocks/server/seed'
import { addToCart, expect, test } from './fixtures'

/** Signed-in Ana with Emerald Ape ×2 (1/50) in the cart, on /checkout with the wallet connected. */
async function readyCheckout(page: Page, loginAs: (user: 'ana') => Promise<void>) {
  await page.goto('/')
  await loginAs('ana')
  await addToCart(page, [['emerald-ape-042', 'ed-1-50', 2]])
  await page.goto('/checkout')
  await expect(page.getByTestId('checkout-total')).toHaveText('2.396 ETH')
  await page.getByRole('button', { name: 'Conectar carteira' }).click()
  await expect(page.getByTestId('wallet-status')).toContainText('MetaMask conectada')
}

/** The collector form is collapsed on mobile (the Figma mobile frame has no form). */
async function openCollector(page: Page, isMobile: boolean) {
  if (isMobile) await page.getByText('Perfil do colecionador').click()
}

const review = (page: Page) => page.getByRole('dialog', { name: 'Revise seu pedido' })
const ordersOf = async (mock: { snapshot: () => Promise<unknown> }) =>
  ((await mock.snapshot()) as { orders: { id: string; status: string }[] }).orders

test.describe('T6 — full purchase', () => {
  test('catalog → detail → cart → checkout → review → confirmed receipt (snapshot), cart emptied of what was bought', async ({
    page,
    loginAs,
    mock,
    isMobile,
  }) => {
    await page.goto('/')
    await loginAs('ana')
    await addToCart(page, [['ivory-baron-088', 'ed-1-50', 1]])
    await page.goto('/nft/emerald-ape-042')
    await page.getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true }).click()
    await expect(page).toHaveURL('/cart')
    await page.getByRole('link', { name: 'Comprar', exact: true }).click() // signed in: just "Comprar"
    await expect(page).toHaveURL('/checkout')
    await openCollector(page, isMobile)
    await expect(page.getByRole('textbox', { name: 'Nome de exibição' })).toHaveValue('Ana Sato')

    await page.getByRole('button', { name: 'Conectar carteira' }).click()
    await expect(page.getByTestId('wallet-status')).toBeVisible()
    await page.getByRole('button', { name: 'Confirmar compra' }).click()
    await expect(review(page)).toBeVisible()
    await review(page).getByRole('button', { name: 'Enviar pedido' }).click()

    await expect(page).toHaveURL(/\/orders\/ord_/)
    await expect(page.getByTestId('order-pending').or(page.getByTestId('order-confirmed'))).toBeVisible()
    await expect(page.getByTestId('order-confirmed')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByTestId('receipt-total')).toHaveText('2.996 ETH') // 1.19 + 1.79 + 0.016

    // Receipt is a snapshot: later catalog changes don't alter it (P9).
    await mock.updateNft('emerald-ape-042', { priceEth: '9.99' })
    await page.reload()
    await expect(page.getByTestId('receipt-total')).toHaveText('2.996 ETH')

    // Simulated explorer, owner only.
    await page.getByRole('link', { name: 'Ver no explorador (simulado)' }).click()
    await expect(page.getByRole('heading', { name: 'Explorador de transações (simulado)' })).toBeVisible()
    await expect(page.getByText('Confirmada', { exact: true })).toBeVisible()

    // Purchased quantities were removed from the cart by the server (P8; partial removal is unit tested).
    await page.goto('/cart')
    await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
  })
})

test.describe('T7 — failures, double click, timeout', () => {
  test.describe('payment declined', () => {
    test.use({ scenario: 'payment-declined' })
    test('shows the refusal and keeps the items in the cart (P6, P8)', async ({ page, loginAs }) => {
      await readyCheckout(page, loginAs)
      await page.getByRole('button', { name: 'Confirmar compra' }).click()
      await review(page).getByRole('button', { name: 'Enviar pedido' }).click()
      await expect(page.getByTestId('order-declined')).toBeVisible({ timeout: 15_000 })
      await expect(page.getByTestId('order-confirmed')).toHaveCount(0) // never shows a receipt (X3)
      await page.goto('/cart')
      await expect(page.getByTestId('cart-total')).toHaveText('2.396 ETH')
    })
  })

  test('repeated clicks create a single order (P5)', async ({ page, loginAs, mock }) => {
    await readyCheckout(page, loginAs)
    await page.getByRole('button', { name: 'Confirmar compra' }).click()
    const submit = review(page).getByRole('button', { name: 'Enviar pedido' })
    await submit.click()
    // Disabled while in flight; it also detaches on navigation — short timeout, ignore the outcome.
    await submit.click({ force: true, timeout: 1_000 }).catch(() => undefined)
    await page
      .getByRole('button', { name: 'Confirmar compra' })
      .click({ force: true, timeout: 1_000 })
      .catch(() => undefined)
    await expect(page).toHaveURL(/\/orders\/ord_/)
    expect(await ordersOf(mock)).toHaveLength(1)
  })

  test.describe('timeout after the order was created', () => {
    test.use({ scenario: 'order-timeout' })
    test('the retry with the same Idempotency-Key recovers the same order', async ({ page, loginAs, mock }) => {
      await page.clock.install()
      await readyCheckout(page, loginAs)
      await page.getByRole('button', { name: 'Confirmar compra' }).click()
      await review(page).getByRole('button', { name: 'Enviar pedido' }).click()
      await expect.poll(() => ordersOf(mock)).toHaveLength(1) // created server-side, response never arrives
      await page.clock.fastForward(16_000) // JS-timer timeout fires → automatic retry, same key
      await expect(page).toHaveURL(/\/orders\/ord_/)
      expect(await ordersOf(mock)).toHaveLength(1)
    })
  })

  test.describe('wallet refuses the connection', () => {
    test.use({ scenario: 'wallet-rejected' })
    test('explains and blocks the purchase until connected', async ({ page, loginAs }) => {
      await page.goto('/')
      await loginAs('ana')
      await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
      await page.goto('/checkout')
      await page.getByRole('button', { name: 'Conectar carteira' }).click()
      await expect(page.getByRole('alert').filter({ hasText: 'A conexão foi recusada na carteira' })).toBeVisible()
      await page.getByRole('button', { name: 'Confirmar compra' }).click()
      await expect(review(page)).toHaveCount(0)
    })
  })

  test('session expires during checkout: re-auth keeps the filled form (A4)', async ({ page, loginAs, mock, isMobile }) => {
    await readyCheckout(page, loginAs)
    await openCollector(page, isMobile)
    await page.getByRole('textbox', { name: 'Observação do colecionador (opcional)' }).fill('Entregar na carteira principal')
    await mock.expireSession()
    await page.getByRole('button', { name: 'Desconectar' }).click() // any private call now gets 401
    const reauth = page.getByRole('dialog', { name: 'Sua sessão expirou' })
    await expect(reauth).toBeVisible()
    await reauth.getByLabel('Senha', { exact: true }).fill(DEMO_PASSWORD)
    await reauth.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(reauth).toBeHidden()
    await expect(page).toHaveURL('/checkout')
    await expect(page.getByRole('textbox', { name: 'Observação do colecionador (opcional)' })).toHaveValue('Entregar na carteira principal')
  })
})
