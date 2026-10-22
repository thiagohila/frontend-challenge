import type { Page } from '@playwright/test'
import type { RealtimeEvent } from '../src/contracts/events'
import { addToCart, expect, test } from './fixtures'

type Mock = Parameters<Parameters<typeof test>[2]>[0]['mock']

async function openReview(page: Page, loginAs: (user: 'ana') => Promise<void>, mock: Mock) {
  await page.goto('/')
  await loginAs('ana')
  await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
  await page.goto('/checkout')
  await expect(page.getByTestId('checkout-total')).toHaveText('1.206 ETH')
  await expect.poll(() => mock.socketConnections()).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Conectar carteira' }).click()
  await expect(page.getByTestId('wallet-status')).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(review(page)).toBeVisible()
}

const review = (page: Page) => page.getByRole('dialog', { name: 'Revise seu pedido' })
const orders = async (mock: Mock) =>
  ((await mock.snapshot()) as { orders: { id: string; status: string; version: number; userId: string }[] }).orders

test.describe('T9 — price/stock changes via Socket.IO during checkout (RT7, P4)', () => {
  test('a price event while reviewing forces a new confirmation, and the order uses the new price', async ({ page, loginAs, mock }) => {
    await openReview(page, loginAs, mock)
    await mock.updateNft('emerald-ape-042', { priceEth: '1.50' }) // server change → nft.updated → quote re-priced
    await expect(review(page).getByTestId('review-changed')).toBeVisible()
    await expect(review(page).getByTestId('checkout-total')).toHaveText('1.516 ETH')

    const submit = review(page).getByRole('button', { name: 'Confirmar novos valores' })
    await submit.click() // acknowledges only — no order yet
    expect(await orders(mock)).toHaveLength(0)
    await review(page).getByRole('button', { name: 'Enviar pedido' }).click()
    await expect(page.getByTestId('order-confirmed')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByTestId('receipt-total')).toHaveText('1.516 ETH')
  })

  test.describe('the server rejects a stale quote at confirmation', () => {
    test.use({ scenario: 'price-change-checkout' })
    test('shows the new values and requires confirming again', async ({ page, loginAs, mock }) => {
      await openReview(page, loginAs, mock)
      await review(page).getByRole('button', { name: 'Enviar pedido' }).click()
      await expect(page.getByTestId('stale-quote')).toBeVisible()
      await expect(page.getByTestId('checkout-total')).toHaveText('1.306 ETH') // 1.29 + fee
      expect(await orders(mock)).toHaveLength(0)

      await page.getByRole('button', { name: 'Confirmar compra' }).click()
      await review(page).getByRole('button', { name: 'Enviar pedido' }).click()
      await expect(page.getByTestId('order-confirmed')).toBeVisible({ timeout: 15_000 })
      await expect(page.getByTestId('receipt-total')).toHaveText('1.306 ETH')
    })
  })
})

test.describe('P4 — revalidation of fees and stock at confirmation', () => {
  test('a network fee change makes the quote stale: new values shown, confirmation required again', async ({ page, loginAs, mock }) => {
    await openReview(page, loginAs, mock)
    await mock.setNetworkFee('ethereum', '0.020')
    await review(page).getByRole('button', { name: 'Enviar pedido' }).click()
    await expect(page.getByTestId('stale-quote')).toBeVisible()
    await expect(page.getByTestId('checkout-total')).toHaveText('1.21 ETH') // 1.19 + 0.020
    expect(await orders(mock)).toHaveLength(0)
  })

  test.describe('the edition sells out at confirmation', () => {
    test.use({ scenario: 'sold-out-checkout' })
    test('no order is created and the buyer is told why', async ({ page, loginAs, mock }) => {
      await openReview(page, loginAs, mock)
      await review(page).getByRole('button', { name: 'Enviar pedido' }).click()
      await expect(page.getByText('Esgotado: Emerald Ape #042. O item saiu do seu carrinho.').first()).toBeVisible()
      await expect(page.getByTestId('quote-error')).not.toContainText('Não foi possível calcular') // definitive, not "retry"
      expect(await orders(mock)).toHaveLength(0)
    })
  })
})

test.describe('T10 — pending order: reloads, disconnections, duplicate/stale events (RT8, RT3, RT5)', () => {
  test('order.updated over the live socket confirms the pending order and announces it (RT2)', async ({ page, loginAs, mock }) => {
    await openReview(page, loginAs, mock)
    await mock.setOrderResolution(60_000)
    await review(page).getByRole('button', { name: 'Enviar pedido' }).click()
    await expect(page.getByTestId('order-pending')).toBeVisible()
    const [order] = await orders(mock)
    if (!order) throw new Error('order not created')
    await expect.poll(() => mock.socketConnections()).toBeGreaterThan(0)

    await mock.resolveOrder(order.id, 'confirmed')
    await expect(page.getByTestId('order-confirmed')).toBeVisible()
    // Only the socket path announces (the polling fallback just refetches): proves the event was applied.
    await expect(page.getByTestId('live-region')).toContainText('Pagamento confirmado.')
  })

  test('pending survives a reload and a dropped connection, resolves once, and old/foreign events never regress it', async ({
    page,
    loginAs,
    mock,
  }) => {
    await openReview(page, loginAs, mock)
    await mock.setOrderResolution(60_000) // keep it pending until we resolve it
    await review(page).getByRole('button', { name: 'Enviar pedido' }).click()
    await expect(page.getByTestId('order-pending')).toBeVisible()
    const [order] = await orders(mock)
    if (!order) throw new Error('order not created')

    await page.reload()
    await expect(page.getByTestId('order-pending')).toBeVisible()

    // Elsewhere in the app the pending order is surfaced, never re-bought.
    await page.goto('/')
    await expect(page.getByTestId('pending-order-banner')).toBeVisible()
    await page.getByRole('link', { name: 'Acompanhar pedido' }).click()
    await expect(page.getByTestId('order-pending')).toBeVisible()

    await expect.poll(() => mock.socketConnections()).toBeGreaterThan(0)
    await mock.dropConnection()
    await mock.resolveOrder(order.id, 'confirmed') // event emitted while disconnected
    await expect(page.getByTestId('order-confirmed')).toBeVisible({ timeout: 15_000 }) // reconnect → REST reconcile / polling

    // A stale "declined" event and another user's event must not regress the terminal state.
    const stale: RealtimeEvent = {
      eventId: 'evt-stale',
      type: 'order.updated',
      resourceId: order.id,
      version: 1,
      occurredAt: new Date().toISOString(),
      userId: order.userId,
      payload: { status: 'declined', txHash: null, declineReason: 'stale' },
    }
    await mock.emitRaw(stale)
    await mock.emitRaw({ ...stale, eventId: 'evt-foreign', version: 99, userId: 'usr_bruno' })
    await page.waitForTimeout(500)
    await expect(page.getByTestId('order-confirmed')).toBeVisible()
    expect(await orders(mock)).toHaveLength(1)
  })
})
