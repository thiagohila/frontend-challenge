import { z } from '@/lib/z'
import { id, money, quantity } from './common'
import { artSchema } from './nft'

export const cartItemSchema = z.object({
  id,
  nftId: id,
  editionId: id,
  quantity,
  name: z.string(),
  number: z.number().int(),
  art: artSchema,
  tokenId: z.string(),
  editionLabel: z.string(),
  unitPriceEth: money,
  lineTotalEth: money,
  available: z.number().int().min(0),
  maxPerOrder: z.number().int().positive(),
  nftVersion: z.number().int().min(1),
})
export type CartItem = z.infer<typeof cartItemSchema>

export const couponSchema = z.object({ code: z.string(), label: z.string(), percentOff: z.number().min(0).max(100) })
export type Coupon = z.infer<typeof couponSchema>

export const cartSchema = z.object({
  id,
  items: z.array(cartItemSchema),
  coupon: couponSchema.nullable(),
  itemCount: z.number().int().min(0), // total units
})
export type Cart = z.infer<typeof cartSchema>

export const addCartItemSchema = z.object({ nftId: id, editionId: id, quantity })
export type AddCartItem = z.infer<typeof addCartItemSchema>

export const updateCartItemSchema = z.object({ quantity })

export const applyCouponSchema = z.object({ code: z.string().trim().min(1, 'Informe o código').max(24) })

export const mergeCartSchema = z.object({ guestCartId: id })
export const mergeCartResponseSchema = z.object({
  cart: cartSchema,
  adjustments: z.array(z.object({ nftId: id, editionId: id, requested: quantity, applied: z.number().int().min(0) })),
})
export type MergeCartResponse = z.infer<typeof mergeCartResponseSchema>
