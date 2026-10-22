import type { AddCartItem, Cart, CartItem } from '@/contracts/cart'
import { money } from '@/lib/money'
import { newId, type ServerContext } from '../context'
import type { CartRecord, DbState } from '../db'
import { HttpError, notFound } from '../errors'
import { findNft } from './catalog'
import { couponStatus } from './coupons'

export type CartOwner = { kind: 'user'; userId: string } | { kind: 'guest'; guestId: string }

export const ownerKeyOf = (owner: CartOwner) => (owner.kind === 'user' ? `user:${owner.userId}` : `guest:${owner.guestId}`)

export function ensureCart(state: DbState, owner: CartOwner): CartRecord {
  const ownerKey = ownerKeyOf(owner)
  let cart = state.carts.find((candidate) => candidate.ownerKey === ownerKey)
  if (!cart) {
    cart = { id: newId('cart'), ownerKey, items: [], couponCode: null }
    state.carts.push(cart)
  }
  return cart
}

export function availableFor(state: DbState, nftId: string, editionId: string) {
  const nft = findNft(state, nftId)
  const edition = nft.editions.find((candidate) => candidate.id === editionId)
  if (!edition) throw notFound('Edição')
  return { nft, edition, limit: Math.min(edition.available, nft.maxPerOrder) }
}

export function toCartView(state: DbState, cart: CartRecord, now: number): Cart {
  const items: CartItem[] = cart.items.flatMap((item) => {
    const nft = state.nfts.find((candidate) => candidate.id === item.nftId)
    const edition = nft?.editions.find((candidate) => candidate.id === item.editionId)
    if (!nft || !edition) return []
    return [
      {
        id: item.id,
        nftId: nft.id,
        editionId: edition.id,
        quantity: item.quantity,
        name: nft.name,
        number: nft.number,
        art: nft.art,
        tokenId: nft.tokenId,
        editionLabel: edition.label,
        unitPriceEth: nft.priceEth,
        lineTotalEth: money.times(nft.priceEth, item.quantity),
        available: edition.available,
        maxPerOrder: nft.maxPerOrder,
        nftVersion: nft.version,
      },
    ]
  })
  const coupon = cart.couponCode ? state.coupons.find((candidate) => candidate.code === cart.couponCode) : undefined
  const validCoupon = coupon && couponStatus(coupon, now) === 'valid' ? coupon : null
  return {
    id: cart.id,
    items,
    coupon: validCoupon ? { code: validCoupon.code, label: validCoupon.label, percentOff: validCoupon.percentOff } : null,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

const outOfStock = (available: number) =>
  new HttpError(409, 'OUT_OF_STOCK', available === 0 ? 'Esta edição está esgotada.' : `Disponível: ${available} unidade(s) desta edição.`, {
    details: { available },
  })

export async function getCart(ctx: ServerContext, owner: CartOwner) {
  return ctx.db.write((state) => toCartView(state, ensureCart(state, owner), ctx.now()))
}

export const addItem = (ctx: ServerContext, owner: CartOwner, input: AddCartItem) =>
  ctx.db.write((state) => {
    const cart = ensureCart(state, owner)
    const { limit } = availableFor(state, input.nftId, input.editionId)
    const existing = cart.items.find((item) => item.nftId === input.nftId && item.editionId === input.editionId)
    const nextQuantity = (existing?.quantity ?? 0) + input.quantity
    if (nextQuantity > limit) throw outOfStock(limit)
    if (existing) existing.quantity = nextQuantity
    else cart.items.push({ id: newId('item'), nftId: input.nftId, editionId: input.editionId, quantity: input.quantity })
    return toCartView(state, cart, ctx.now())
  })

export const updateItem = (ctx: ServerContext, owner: CartOwner, itemId: string, quantity: number) =>
  ctx.db.write((state) => {
    const cart = ensureCart(state, owner)
    const item = cart.items.find((candidate) => candidate.id === itemId)
    if (!item) throw notFound('Item do carrinho')
    const { limit } = availableFor(state, item.nftId, item.editionId)
    if (quantity > limit) throw outOfStock(limit)
    item.quantity = quantity
    return toCartView(state, cart, ctx.now())
  })

export const removeItem = (ctx: ServerContext, owner: CartOwner, itemId: string) =>
  ctx.db.write((state) => {
    const cart = ensureCart(state, owner)
    if (!cart.items.some((candidate) => candidate.id === itemId)) throw notFound('Item do carrinho')
    cart.items = cart.items.filter((candidate) => candidate.id !== itemId)
    return toCartView(state, cart, ctx.now())
  })

export const applyCoupon = (ctx: ServerContext, owner: CartOwner, code: string) =>
  ctx.db.write((state) => {
    const normalized = code.trim().toUpperCase()
    const coupon = state.coupons.find((candidate) => candidate.code === normalized)
    const status = coupon ? couponStatus(coupon, ctx.now(), ctx.flags.allCouponsExpired) : 'invalid'
    if (status === 'invalid') throw new HttpError(422, 'COUPON_INVALID', 'Cupom inválido.', { fields: { code: 'Cupom inválido' } })
    if (status === 'expired') throw new HttpError(422, 'COUPON_EXPIRED', 'Este cupom expirou.', { fields: { code: 'Cupom expirado' } })
    const cart = ensureCart(state, owner)
    cart.couponCode = normalized
    return toCartView(state, cart, ctx.now())
  })

export const removeCoupon = (ctx: ServerContext, owner: CartOwner) =>
  ctx.db.write((state) => {
    const cart = ensureCart(state, owner)
    cart.couponCode = null
    return toCartView(state, cart, ctx.now())
  })

/** Guest → user on sign-in: sums by (nft, edition), clamps to stock and reports adjustments (K3). */
export const mergeGuestCart = (ctx: ServerContext, userId: string, guestId: string) =>
  ctx.db.write((state) => {
    const userCart = ensureCart(state, { kind: 'user', userId })
    const guestKey = ownerKeyOf({ kind: 'guest', guestId })
    const guestCart = state.carts.find((candidate) => candidate.ownerKey === guestKey)
    const adjustments: { nftId: string; editionId: string; requested: number; applied: number }[] = []
    for (const item of guestCart?.items ?? []) {
      const { limit } = availableFor(state, item.nftId, item.editionId)
      const existing = userCart.items.find((candidate) => candidate.nftId === item.nftId && candidate.editionId === item.editionId)
      const requested = (existing?.quantity ?? 0) + item.quantity
      const applied = Math.min(requested, limit)
      if (applied !== requested) adjustments.push({ nftId: item.nftId, editionId: item.editionId, requested, applied })
      if (existing) existing.quantity = applied
      else if (applied > 0) userCart.items.push({ ...item, id: newId('item'), quantity: applied })
    }
    userCart.items = userCart.items.filter((item) => item.quantity > 0)
    if (guestCart?.couponCode && !userCart.couponCode) userCart.couponCode = guestCart.couponCode
    state.carts = state.carts.filter((candidate) => candidate.ownerKey !== guestKey)
    return { cart: toCartView(state, userCart, ctx.now()), adjustments }
  })
