import { type AddCartItem, cartSchema } from '@/contracts/cart'
import type { Network } from '@/contracts/common'
import { quoteSchema } from '@/contracts/quote'
import { http } from '@/lib/http'

export const cartApi = {
  get: async (signal?: AbortSignal) => cartSchema.parse((await http.get('/cart', { signal })).data),
  add: async (input: AddCartItem) => cartSchema.parse((await http.post('/cart/items', input)).data),
  update: async (itemId: string, quantity: number) => cartSchema.parse((await http.patch(`/cart/items/${itemId}`, { quantity })).data),
  remove: async (itemId: string) => cartSchema.parse((await http.delete(`/cart/items/${itemId}`)).data),
  applyCoupon: async (code: string) => cartSchema.parse((await http.put('/cart/coupon', { code })).data),
  removeCoupon: async () => cartSchema.parse((await http.delete('/cart/coupon')).data),
  quote: async (network: Network, signal?: AbortSignal) => quoteSchema.parse((await http.post('/quote', { network }, { signal })).data),
}
