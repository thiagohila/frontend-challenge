import type { CreateOrder, Order } from '@/contracts/order'
import { money } from '@/lib/money'
import { hashPayload } from '../crypto'
import { bus, newEventId } from '../bus'
import { iso, newId, type ServerContext } from '../context'
import type { DbState, OrderRecord, UserRecord } from '../db'
import { HttpError, notFound } from '../errors'
import { requireActive } from './auth'
import { ensureCart } from './cart'
import { applyNftPatch } from './catalog'
import { buildQuote, isQuoteStale, toQuoteView } from './quote'

export const ORDER_RESOLUTION_MS = 3_000

export const toOrderView = (order: OrderRecord): Order => ({
  id: order.id,
  status: order.status,
  version: order.version,
  createdAt: order.createdAt,
  resolvedAt: order.resolvedAt,
  declineReason: order.declineReason,
  txHash: order.txHash,
  receipt: order.receipt,
})

const randomHex = (bytes: number) =>
  [...crypto.getRandomValues(new Uint8Array(bytes))].map((byte) => byte.toString(16).padStart(2, '0')).join('')

/**
 * Idempotent order creation (ARCHITECTURE §4, ADR 14). Order of checks matters:
 * 1) same key → same order (no revalidation); 2) one pending order per user; 3) validate quote/stock/wallet.
 */
export async function createOrder(
  ctx: ServerContext,
  user: UserRecord,
  idempotencyKey: string,
  input: CreateOrder,
): Promise<{ order: Order; replayed: boolean }> {
  const requestHash = await hashPayload(input)
  return ctx.db.write((state) => {
    const existing = state.orders.find((order) => order.userId === user.id && order.idempotencyKey === idempotencyKey)
    if (existing) {
      if (existing.requestHash !== requestHash) {
        throw new HttpError(409, 'IDEMPOTENCY_CONFLICT', 'Esta tentativa de compra já foi usada com outros dados.')
      }
      return { order: toOrderView(existing), replayed: true }
    }

    const pending = state.orders.find((order) => order.userId === user.id && order.status === 'pending')
    if (pending) {
      throw new HttpError(409, 'CONFLICT', 'Você já tem um pedido em processamento.', { details: { orderId: pending.id } })
    }

    requireActive(user)
    const owner = { kind: 'user', userId: user.id } as const
    const wallet = state.wallets.find((candidate) => candidate.id === input.walletId && candidate.userId === user.id)
    if (!wallet) throw notFound('Carteira')
    const connected = state.connections.some(
      (connection) => connection.walletId === wallet.id && connection.userId === user.id && connection.status === 'connected',
    )
    if (!connected) throw new HttpError(409, 'WALLET_DISCONNECTED', 'Conecte sua carteira antes de confirmar a compra.')

    const quote = state.quotes.find((candidate) => candidate.quoteId === input.quoteId && candidate.ownerKey === `user:${user.id}`)
    if (!quote)
      throw new HttpError(409, 'QUOTE_STALE', 'A cotação expirou. Revise os valores.', {
        details: { quote: toQuoteView(buildQuote(ctx, state, owner, input.network)) },
      })

    simulateCheckoutRace(ctx, state, quote.lines[0])

    if (quote.network !== input.network || isQuoteStale(ctx, state, quote, owner)) {
      const fresh = buildQuote(ctx, state, owner, input.network)
      throw new HttpError(409, 'QUOTE_STALE', 'Preço, disponibilidade ou taxas mudaram. Revise e confirme novamente.', {
        details: { quote: toQuoteView(fresh) },
      })
    }

    // Reserve stock now; released if the payment is declined.
    for (const line of quote.lines) {
      const nft = state.nfts.find((candidate) => candidate.id === line.nftId)
      const edition = nft?.editions.find((candidate) => candidate.id === line.editionId)
      if (nft && edition)
        applyNftPatch(ctx, state, nft.id, { editions: [{ id: edition.id, available: edition.available - line.quantity }] })
    }

    const createdAt = ctx.now()
    const order: OrderRecord = {
      id: newId('ord'),
      userId: user.id,
      idempotencyKey,
      requestHash,
      quoteId: quote.quoteId,
      status: 'pending',
      version: 1,
      createdAt: iso(createdAt),
      resolvedAt: null,
      declineReason: null,
      txHash: null,
      plannedOutcome: ctx.flags.paymentOutcome ?? 'confirmed',
      resolveAt: iso(createdAt + ctx.orderResolutionMs()),
      reservations: quote.lines.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity })),
      receipt: {
        lines: quote.lines,
        subtotalEth: quote.subtotalEth,
        discountEth: quote.discountEth,
        networkFeeEth: quote.networkFeeEth,
        totalEth: quote.totalEth,
        network: input.network,
        walletLabel: wallet.alias,
        walletType: wallet.walletType,
      },
    }
    state.orders.push(order)
    ctx.schedule(() => void resolveDueOrders(ctx), ctx.orderResolutionMs())
    return { order: toOrderView(order), replayed: false }
  })
}

/** Scenario hooks: the catalog changes right when the buyer confirms (REQUIREMENTS M5, RT7). */
function simulateCheckoutRace(ctx: ServerContext, state: DbState, line: OrderRecord['receipt']['lines'][number] | undefined) {
  if (!line) return
  if (ctx.flags.priceChangeOnCheckout && ctx.consumeFlag('price-change-checkout')) {
    const nft = state.nfts.find((candidate) => candidate.id === line.nftId)
    if (nft) applyNftPatch(ctx, state, nft.id, { priceEth: money.add(nft.priceEth, '0.10') })
  }
  if (ctx.flags.soldOutOnCheckout && ctx.consumeFlag('sold-out-checkout')) {
    applyNftPatch(ctx, state, line.nftId, { editions: [{ id: line.editionId, available: 0 }] })
  }
}

function resolveOrder(ctx: ServerContext, state: DbState, order: OrderRecord, outcome: 'confirmed' | 'declined') {
  if (order.status !== 'pending') return // confirmed/declined are terminal
  order.status = outcome
  order.version += 1
  order.resolvedAt = iso(ctx.now())
  if (outcome === 'confirmed') {
    order.txHash = `0x${randomHex(32)}`
    // Remove only what was bought, from the user's current cart (P8).
    const cart = ensureCart(state, { kind: 'user', userId: order.userId })
    for (const bought of order.reservations) {
      const item = cart.items.find((candidate) => candidate.nftId === bought.nftId && candidate.editionId === bought.editionId)
      if (item) item.quantity -= bought.quantity
    }
    cart.items = cart.items.filter((item) => item.quantity > 0)
    cart.couponCode = null
  } else {
    order.declineReason = 'Pagamento recusado pela carteira.'
    for (const reserved of order.reservations) {
      const nft = state.nfts.find((candidate) => candidate.id === reserved.nftId)
      const edition = nft?.editions.find((candidate) => candidate.id === reserved.editionId)
      if (nft && edition)
        applyNftPatch(ctx, state, nft.id, { editions: [{ id: edition.id, available: edition.available + reserved.quantity }] })
    }
  }
  bus.publish({
    eventId: newEventId(),
    type: 'order.updated',
    resourceId: order.id,
    version: order.version,
    occurredAt: order.resolvedAt,
    userId: order.userId,
    payload: { status: order.status, txHash: order.txHash, declineReason: order.declineReason },
  })
}

/** Resolves pending orders whose time has come — called on schedule, on boot and on reads (C4). */
export const resolveDueOrders = (ctx: ServerContext) =>
  ctx.db.write((state) => {
    for (const order of state.orders) {
      if (order.status === 'pending' && Date.parse(order.resolveAt) <= ctx.now()) resolveOrder(ctx, state, order, order.plannedOutcome)
    }
  })

/** Re-arms timers for pending orders after a reload (the timer died with the previous page). */
export async function rescheduleOrders(ctx: ServerContext) {
  const state = await ctx.db.read()
  for (const order of state.orders.filter((candidate) => candidate.status === 'pending')) {
    ctx.schedule(() => void resolveDueOrders(ctx), Math.max(0, Date.parse(order.resolveAt) - ctx.now()))
  }
  await resolveDueOrders(ctx)
}

export const forceResolveOrder = (ctx: ServerContext, orderId: string, outcome: 'confirmed' | 'declined') =>
  ctx.db.write((state) => {
    const order = state.orders.find((candidate) => candidate.id === orderId)
    if (!order) throw notFound('Pedido')
    resolveOrder(ctx, state, order, outcome)
    return toOrderView(order)
  })

export async function getOrder(ctx: ServerContext, userId: string, orderId: string) {
  await resolveDueOrders(ctx)
  const state = await ctx.db.read()
  const order = state.orders.find((candidate) => candidate.id === orderId && candidate.userId === userId)
  if (!order) throw notFound('Pedido') // other users' orders are indistinguishable from missing (ADR 8)
  return toOrderView(order)
}

export async function listOrders(ctx: ServerContext, userId: string, status?: Order['status']) {
  await resolveDueOrders(ctx)
  const state = await ctx.db.read()
  return {
    items: state.orders.filter((order) => order.userId === userId && (!status || order.status === status)).map(toOrderView),
  }
}

export async function getTransaction(ctx: ServerContext, userId: string, hash: string) {
  const state = await ctx.db.read()
  const order = state.orders.find((candidate) => candidate.txHash === hash && candidate.userId === userId)
  if (!order?.txHash) throw notFound('Transação')
  return {
    hash: order.txHash,
    network: order.receipt.network,
    status: order.status,
    totalEth: order.receipt.totalEth,
    confirmedAt: order.resolvedAt,
  }
}
