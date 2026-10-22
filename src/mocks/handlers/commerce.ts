import { delay, HttpResponse } from 'msw'
import { addCartItemSchema, applyCouponSchema, mergeCartSchema, updateCartItemSchema } from '@/contracts/cart'
import { createOrderSchema, orderStatusSchema } from '@/contracts/order'
import { quoteRequestSchema } from '@/contracts/quote'
import { runtime } from '../runtime'
import { serverContext as ctx } from '../server/browser-context'
import { validation } from '../server/errors'
import { addItem, applyCoupon, getCart, mergeGuestCart, removeCoupon, removeItem, updateItem } from '../server/services/cart'
import { createOrder, getOrder, getTransaction, listOrders } from '../server/services/orders'
import { createQuote } from '../server/services/quote'
import { route } from './route'

export const commerceHandlers = [
  route('get', '/cart', async ({ owner }) => getCart(ctx, await owner())),
  route('post', '/cart/items', async ({ owner, body }) => addItem(ctx, await owner(), await body(addCartItemSchema))),
  route('patch', '/cart/items/:itemId', async ({ owner, params, body }) =>
    updateItem(ctx, await owner(), String(params.itemId), (await body(updateCartItemSchema)).quantity),
  ),
  route('delete', '/cart/items/:itemId', async ({ owner, params }) => removeItem(ctx, await owner(), String(params.itemId))),
  route('put', '/cart/coupon', async ({ owner, body }) => applyCoupon(ctx, await owner(), (await body(applyCouponSchema)).code)),
  route('delete', '/cart/coupon', async ({ owner }) => removeCoupon(ctx, await owner())),
  route('post', '/cart/merge', async ({ user, body }) => mergeGuestCart(ctx, (await user()).id, (await body(mergeCartSchema)).guestCartId)),

  route('post', '/quote', async ({ owner, body }) => createQuote(ctx, await owner(), (await body(quoteRequestSchema)).network)),

  route(
    'post',
    '/orders',
    async ({ user, request, body }) => {
      const key = request.headers.get('Idempotency-Key')
      if (!key) throw validation({ idempotencyKey: 'Cabeçalho Idempotency-Key obrigatório' })
      const { order, replayed } = await createOrder(ctx, await user(), key, await body(createOrderSchema))
      // `order-timeout` scenario: the order IS created, but the response never arrives (client times out).
      if (!replayed && ctx.flags.orderTimeoutAfterCommit && runtime.consumeFlag('order-timeout')) {
        await delay('infinite')
      }
      return HttpResponse.json(order, { status: replayed ? 200 : 201 })
    },
    { private: true },
  ),
  route(
    'get',
    '/orders',
    async ({ user, request }) => {
      const status = new URL(request.url).searchParams.get('status')
      const parsed = status ? orderStatusSchema.safeParse(status) : null
      if (parsed && !parsed.success) throw validation({ status: 'Status inválido' })
      return listOrders(ctx, (await user()).id, parsed?.data)
    },
    { private: true },
  ),
  route('get', '/orders/:id', async ({ user, params }) => getOrder(ctx, (await user()).id, String(params.id)), { private: true }),
  route('get', '/tx/:hash', async ({ user, params }) => getTransaction(ctx, (await user()).id, String(params.hash)), { private: true }),
]
