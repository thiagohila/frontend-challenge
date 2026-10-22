import type { Network } from '@/contracts/common'
import type { Quote, QuoteChange } from '@/contracts/quote'
import { money } from '@/lib/money'
import { iso, newId, type ServerContext } from '../context'
import type { DbState, QuoteRecord } from '../db'
import { HttpError } from '../errors'
import { type CartOwner, ensureCart, ownerKeyOf, toCartView } from './cart'

const QUOTE_TTL_MS = 5 * 60_000
export const NETWORK_FEES: Record<Network, string> = { ethereum: '0.016', polygon: '0.002', solana: '0.001' }

export const networkFee = (state: DbState, network: Network) => state.networkFees?.[network] ?? NETWORK_FEES[network]

/** Prices the cart server-side — the quote is the reference to place an order (K5, K8). */
export function buildQuote(ctx: ServerContext, state: DbState, owner: CartOwner, network: Network): QuoteRecord {
  const ownerKey = ownerKeyOf(owner)
  const record = ensureCart(state, owner)
  // Stock may have dropped since the item was added: clamp quantities to what is purchasable now.
  // Only these server-side adjustments (and price changes) are reported — never the user's own edits.
  const changes: QuoteChange[] = []
  record.items = record.items
    .map((item) => {
      const nft = state.nfts.find((candidate) => candidate.id === item.nftId)
      const edition = nft?.editions.find((candidate) => candidate.id === item.editionId)
      const limit = nft && edition ? Math.min(edition.available, nft.maxPerOrder) : 0
      const quantity = Math.min(item.quantity, limit)
      if (quantity !== item.quantity) {
        changes.push({
          nftId: item.nftId,
          editionId: item.editionId,
          name: nft ? `${nft.name} #${String(nft.number).padStart(3, '0')}` : item.nftId,
          kind: quantity === 0 ? 'removed' : 'availability',
          from: String(item.quantity),
          to: String(quantity),
        })
      }
      return { ...item, quantity }
    })
    .filter((item) => item.quantity > 0)
  const cart = toCartView(state, record, ctx.now())
  if (cart.items.length === 0) {
    const soldOut = changes.filter((change) => change.kind === 'removed').map((change) => change.name)
    if (soldOut.length > 0) throw new HttpError(409, 'OUT_OF_STOCK', `Esgotado: ${soldOut.join(', ')}. O item saiu do seu carrinho.`)
    throw new HttpError(422, 'VALIDATION', 'Seu carrinho está vazio.')
  }

  const lines = cart.items.map((item) => ({
    nftId: item.nftId,
    editionId: item.editionId,
    name: `${item.name} #${String(item.number).padStart(3, '0')}`,
    art: item.art,
    tokenId: item.tokenId,
    editionLabel: item.editionLabel,
    quantity: item.quantity,
    unitPriceEth: item.unitPriceEth,
    lineTotalEth: item.lineTotalEth,
  }))
  const subtotalEth = money.add(...lines.map((line) => line.lineTotalEth))
  const discountEth = cart.coupon ? money.percent(subtotalEth, cart.coupon.percentOff) : money.zero
  const networkFeeEth = networkFee(state, network)

  // Prices are the server's: a different unit price than the previous quote is always a market change.
  const previous = state.quotes.filter((quote) => quote.ownerKey === ownerKey).at(-1)
  for (const line of previous?.lines ?? []) {
    const current = lines.find((candidate) => candidate.nftId === line.nftId && candidate.editionId === line.editionId)
    if (current && !money.equals(current.unitPriceEth, line.unitPriceEth))
      changes.push({
        nftId: line.nftId,
        editionId: line.editionId,
        name: line.name,
        kind: 'price',
        from: line.unitPriceEth,
        to: current.unitPriceEth,
      })
  }

  const quote: QuoteRecord = {
    quoteId: newId('qt'),
    ownerKey,
    network,
    expiresAt: iso(ctx.now() + QUOTE_TTL_MS),
    lines,
    coupon: cart.coupon,
    subtotalEth,
    discountEth,
    networkFeeEth,
    networkFeeEstimated: true,
    totalEth: money.add(money.sub(subtotalEth, discountEth), networkFeeEth),
    changes,
  }
  // Keep only the latest quote per owner.
  state.quotes = [...state.quotes.filter((candidate) => candidate.ownerKey !== ownerKey), quote]
  return quote
}

export const toQuoteView = ({ ownerKey: _ownerKey, ...quote }: QuoteRecord): Quote => quote

export const createQuote = (ctx: ServerContext, owner: CartOwner, network: Network) =>
  ctx.db.write((state) => toQuoteView(buildQuote(ctx, state, owner, network)))

/** A quote is stale when expired or when any line no longer matches price/stock. */
export function isQuoteStale(ctx: ServerContext, state: DbState, quote: QuoteRecord, owner: CartOwner): boolean {
  if (Date.parse(quote.expiresAt) <= ctx.now()) return true
  const cart = toCartView(state, ensureCart(state, owner), ctx.now())
  if (cart.items.length !== quote.lines.length) return true
  if ((cart.coupon?.code ?? null) !== (quote.coupon?.code ?? null)) return true
  if (!money.equals(networkFee(state, quote.network), quote.networkFeeEth)) return true
  return quote.lines.some((line) => {
    const item = cart.items.find((candidate) => candidate.nftId === line.nftId && candidate.editionId === line.editionId)
    return !item || item.quantity !== line.quantity || !money.equals(item.unitPriceEth, line.unitPriceEth) || item.available < line.quantity
  })
}
