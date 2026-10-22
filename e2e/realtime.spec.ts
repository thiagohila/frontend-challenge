import type { RealtimeEvent } from '../src/contracts/events'
import { expect, test } from './fixtures'

const priceEvent = (eventId: string, version: number, priceEth: string): RealtimeEvent => ({
  eventId,
  type: 'nft.updated',
  resourceId: 'emerald-ape-042',
  version,
  occurredAt: new Date().toISOString(),
  payload: { priceEth, soldOut: false, editions: [{ id: 'ed-1-50', available: 12 }] },
})

async function waitForSocket(mock: { socketConnections: () => Promise<number> }) {
  await expect.poll(() => mock.socketConnections()).toBeGreaterThan(0)
}

test.describe('realtime — nft.updated through socket.io-client (RT1, M7, M9)', () => {
  test('a server-side change reaches the detail page and the catalog without reload', async ({ page, mock }) => {
    await page.goto('/nft/emerald-ape-042')
    await waitForSocket(mock)
    await mock.updateNft('emerald-ape-042', { priceEth: '2.50' })
    await expect(page.getByText('2.50 ETH').filter({ visible: true }).first()).toBeVisible()
    await expect(page.getByTestId('live-region')).toContainText('O preço ou a disponibilidade deste NFT foi atualizado.')

    await page.goto('/')
    await waitForSocket(mock)
    await mock.updateNft('emerald-ape-042', { priceEth: '3.10' })
    await expect(page.getByRole('article', { name: 'Emerald Ape #042' })).toContainText('3.10 ETH')
  })

  test('open cart: price change updates the line, re-prices the summary and is announced (RT7)', async ({ page, mock }) => {
    await page.goto('/nft/emerald-ape-042')
    await page.getByRole('button', { name: /^(COMPRAR|Comprar NFT)$/ }).click()
    await expect(page.getByTestId('cart-total')).toHaveText('1.206 ETH')
    await waitForSocket(mock)

    await mock.updateNft('emerald-ape-042', { priceEth: '1.50' })
    await expect(page.getByTestId('cart-total')).toHaveText('1.516 ETH')
    await expect(page.getByTestId('quote-changes')).toContainText('Emerald Ape #042: preço de 1.19 ETH para 1.50 ETH.')
    await expect(page.getByTestId('live-region')).toContainText('O resumo foi atualizado')
  })

  test("open cart: a stock drop clamps the line and the summary together; the user's own edits are not reported as changes (RT7, K1)", async ({
    page,
    mock,
    isMobile,
  }) => {
    const line = page.getByTestId(isMobile ? 'cart-card-emerald-ape-042' : 'cart-line-emerald-ape-042')
    await page.goto('/nft/emerald-ape-042?edition=ed-1-10')
    await page.getByRole('button', { name: /^(COMPRAR|Comprar NFT)$/ }).click()
    await expect(page.getByTestId('cart-total')).toHaveText('1.206 ETH')
    await line.getByRole('button', { name: 'Aumentar quantidade' }).click()
    await expect(page.getByTestId('cart-total')).toHaveText('2.396 ETH')
    await expect(page.getByTestId('quote-changes')).toHaveCount(0) // own edit: no "availability" notice
    await waitForSocket(mock)

    await mock.updateNft('emerald-ape-042', { editions: [{ id: 'ed-1-10', available: 1 }] })
    await expect(page.getByTestId('quote-changes')).toContainText('Emerald Ape #042: quantidade ajustada de 2 para 1 (disponibilidade).')
    await expect(page.getByTestId('cart-total')).toHaveText('1.206 ETH')
    await expect(line.locator('output')).toHaveText('1') // the line agrees with the summary
  })

  test('duplicate and stale events are ignored (RT3)', async ({ page, mock }) => {
    await page.goto('/nft/emerald-ape-042')
    await waitForSocket(mock)
    await mock.emitRaw(priceEvent('evt-a', 50, '9.99'))
    await expect(page.getByText('9.99 ETH').filter({ visible: true }).first()).toBeVisible()
    await mock.emitRaw(priceEvent('evt-a', 51, '5.55')) // same eventId → duplicate
    await mock.emitRaw(priceEvent('evt-b', 49, '1.11')) // older version
    await page.waitForTimeout(500)
    await expect(page.getByText('9.99 ETH').filter({ visible: true }).first()).toBeVisible()
    await expect(page.getByText(/5\.55 ETH|1\.11 ETH/)).toHaveCount(0)
  })

  test('a dropped connection reconnects and reconciles missed changes with REST (RT4)', async ({ page, mock }) => {
    await page.goto('/nft/emerald-ape-042')
    await waitForSocket(mock)
    await mock.dropConnection()
    await mock.updateNft('emerald-ape-042', { priceEth: '4.20' }) // emitted while nobody is connected
    await expect(page.getByText('4.20 ETH').filter({ visible: true }).first()).toBeVisible() // recovered by the post-reconnect refetch
    await expect(page.getByTestId('realtime-reconnecting')).toBeHidden()
  })
})
