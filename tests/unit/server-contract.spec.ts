import { expect, test } from '@playwright/test'
import type { CreateOrder } from '../../src/contracts/order'
import { money } from '../../src/lib/money'
import { HttpError } from '../../src/mocks/server/errors'
import { hashPassword } from '../../src/mocks/server/crypto'
import { DEMO_PASSWORD, DEMO_USERS, SEED_PASSWORD_HASHES } from '../../src/mocks/server/seed'
import { login, register } from '../../src/mocks/server/services/auth'
import { addItem, getCart, mergeGuestCart } from '../../src/mocks/server/services/cart'
import { listNfts } from '../../src/mocks/server/services/catalog'
import { connectWallet, disconnectWallet } from '../../src/mocks/server/services/wallets'
import { createOrder, getOrder, ORDER_RESOLUTION_MS } from '../../src/mocks/server/services/orders'
import { createQuote } from '../../src/mocks/server/services/quote'
import { createTestServer } from './server-context'

const ana = { kind: 'user', userId: DEMO_USERS.ana.id } as const
const EMERALD = { nftId: 'emerald-ape-042', editionId: 'ed-1-50' }

async function expectHttpError(promise: Promise<unknown>, status: number, code: string) {
  const error = await promise.then(
    () => null,
    (reason: unknown) => reason,
  )
  expect(error).toBeInstanceOf(HttpError)
  expect(error).toMatchObject({ status, code })
}

async function readyToBuy(server: ReturnType<typeof createTestServer>) {
  const state = await server.ctx.db.read()
  const user = state.users.find((candidate) => candidate.id === DEMO_USERS.ana.id)
  if (!user) throw new Error('seed user missing')
  await addItem(server.ctx, ana, { ...EMERALD, quantity: 2 })
  await connectWallet(server.ctx, user, 'wal_ana_primary', 'ethereum')
  const quote = await createQuote(server.ctx, ana, 'ethereum')
  const input: CreateOrder = {
    quoteId: quote.quoteId,
    walletId: 'wal_ana_primary',
    network: 'ethereum',
    buyer: { displayName: 'Ana Sato', username: 'ana.colecionadora', email: DEMO_USERS.ana.email, note: null },
  }
  return { user, quote, input }
}

test.describe('orders: idempotency (R3, P5)', () => {
  test('same key + same payload returns the same order without revalidating', async () => {
    const server = createTestServer()
    const { user, input } = await readyToBuy(server)
    const first = await createOrder(server.ctx, user, 'key-1', input)
    const retry = await createOrder(server.ctx, user, 'key-1', input)
    expect(retry.replayed).toBe(true)
    expect(retry.order.id).toBe(first.order.id)
    expect((await server.ctx.db.read()).orders).toHaveLength(1)
  })

  test('same key + different payload is a conflict', async () => {
    const server = createTestServer()
    const { user, input } = await readyToBuy(server)
    await createOrder(server.ctx, user, 'key-1', input)
    await expectHttpError(createOrder(server.ctx, user, 'key-1', { ...input, network: 'polygon' }), 409, 'IDEMPOTENCY_CONFLICT')
  })

  test('a new key while an order is pending is rejected with the pending order id', async () => {
    const server = createTestServer()
    const { user, input } = await readyToBuy(server)
    const { order } = await createOrder(server.ctx, user, 'key-1', input)
    const error = await createOrder(server.ctx, user, 'key-2', input).catch((reason: unknown) => reason)
    expect(error).toMatchObject({ status: 409, code: 'CONFLICT', details: { orderId: order.id } })
  })

  test('confirmation removes only the purchased quantities and keeps the receipt snapshot', async () => {
    const server = createTestServer()
    const { user, input } = await readyToBuy(server)
    const { order } = await createOrder(server.ctx, user, 'key-1', input)
    await addItem(server.ctx, ana, { ...EMERALD, quantity: 1 }) // added while pending
    server.advance(ORDER_RESOLUTION_MS)
    await expect.poll(async () => (await getOrder(server.ctx, user.id, order.id)).status).toBe('confirmed')
    const cart = await getCart(server.ctx, ana)
    expect(cart.items).toEqual([expect.objectContaining({ ...EMERALD, quantity: 1 })])
    expect((await getOrder(server.ctx, user.id, order.id)).receipt.lines[0]).toMatchObject({ quantity: 2, unitPriceEth: '1.19' })
  })

  test('price change at confirmation makes the quote stale and returns a fresh one', async () => {
    const server = createTestServer({ priceChangeOnCheckout: true })
    const { user, input } = await readyToBuy(server)
    const error = await createOrder(server.ctx, user, 'key-1', input).catch((reason: unknown) => reason)
    expect(error).toMatchObject({ status: 409, code: 'QUOTE_STALE' })
    const fresh = (error as HttpError).details as { quote: { lines: { unitPriceEth: string }[] } }
    expect(fresh.quote.lines[0]?.unitPriceEth).toBe('1.29')
  })

  test('the wallet must be connected, on the network being paid on (P3, server-side guard)', async () => {
    const server = createTestServer()
    const { user, input } = await readyToBuy(server)
    const polygonQuote = await createQuote(server.ctx, ana, 'polygon')
    await expectHttpError(
      createOrder(server.ctx, user, 'key-network', { ...input, quoteId: polygonQuote.quoteId, network: 'polygon' }),
      409,
      'WALLET_DISCONNECTED',
    )
    await disconnectWallet(server.ctx, user.id, 'wal_ana_primary', 'test')
    await expectHttpError(createOrder(server.ctx, user, 'key-disconnected', input), 409, 'WALLET_DISCONNECTED')
    expect((await server.ctx.db.read()).orders).toHaveLength(0)
  })

  test("another user's order is indistinguishable from a missing one (X4)", async () => {
    const server = createTestServer()
    const { user, input } = await readyToBuy(server)
    const { order } = await createOrder(server.ctx, user, 'key-1', input)
    await expectHttpError(getOrder(server.ctx, DEMO_USERS.bruno.id, order.id), 404, 'NOT_FOUND')
  })
})

test.describe('cart and catalog rules', () => {
  test('cannot exceed edition stock; guest merge clamps and reports adjustments (K1, K3)', async () => {
    const server = createTestServer()
    await expectHttpError(addItem(server.ctx, ana, { nftId: 'emerald-ape-042', editionId: 'ed-1-10', quantity: 4 }), 409, 'OUT_OF_STOCK')
    const guest = { kind: 'guest', guestId: 'guest-1' } as const
    await addItem(server.ctx, guest, { nftId: 'emerald-ape-042', editionId: 'ed-1-10', quantity: 3 })
    await addItem(server.ctx, ana, { nftId: 'emerald-ape-042', editionId: 'ed-1-10', quantity: 2 })
    const merged = await mergeGuestCart(server.ctx, DEMO_USERS.ana.id, 'guest-1')
    expect(merged.adjustments).toEqual([{ nftId: 'emerald-ape-042', editionId: 'ed-1-10', requested: 5, applied: 3 }])
  })

  test('filters combine and facets/pagination reflect the query (C2, C3)', async () => {
    const server = createTestServer()
    const all = await listNfts(server.ctx, {})
    expect(all.total).toBeGreaterThanOrEqual(40)
    expect(all.items).toHaveLength(9)
    const filtered = await listNfts(server.ctx, { collection: ['arte-digital'], network: ['ethereum'], sort: 'price-asc' })
    expect(filtered.items.every((nft) => nft.collection === 'arte-digital' && nft.network === 'ethereum')).toBe(true)
    const prices = filtered.items.map((nft) => nft.priceEth)
    expect(prices).toEqual([...prices].sort(money.compare))
  })
})

test.describe('auth', () => {
  test('seed hashes match DEMO_PASSWORD (precomputed PBKDF2)', async () => {
    for (const [salt, hash] of Object.entries(SEED_PASSWORD_HASHES)) expect(await hashPassword(DEMO_PASSWORD, salt)).toBe(hash)
  })

  test('passwords are hashed; wrong password and duplicate account are rejected (A8, S10)', async () => {
    const server = createTestServer()
    const state = await server.ctx.db.read()
    expect(JSON.stringify(state.users)).not.toContain(DEMO_PASSWORD)
    await expectHttpError(login(server.ctx, { email: DEMO_USERS.ana.email, password: 'wrong-pass1' }), 401, 'UNAUTHORIZED')
    const session = await login(server.ctx, { email: DEMO_USERS.ana.email, password: DEMO_PASSWORD })
    expect(session.user.id).toBe(DEMO_USERS.ana.id)
    await expectHttpError(register(server.ctx, { username: 'nova', email: DEMO_USERS.ana.email, password: 'Senha1234' }), 409, 'CONFLICT')
  })
})
