import { type CreateOrder, orderListSchema, orderSchema, transactionSchema } from '@/contracts/order'
import { http } from '@/lib/http'

const CHECKOUT_TIMEOUT_MS = 15_000

export const ordersApi = {
  /** The Idempotency-Key makes retries after timeouts return the same order (P5, R3). */
  create: async (input: CreateOrder, idempotencyKey: string) =>
    orderSchema.parse(
      (await http.post('/orders', input, { headers: { 'Idempotency-Key': idempotencyKey }, timeoutMs: CHECKOUT_TIMEOUT_MS })).data,
    ),
  get: async (id: string, signal?: AbortSignal) =>
    orderSchema.parse((await http.get(`/orders/${encodeURIComponent(id)}`, { signal })).data),
  pending: async (signal?: AbortSignal) =>
    orderListSchema.parse((await http.get('/orders', { params: { status: 'pending' }, signal })).data).items,
  transaction: async (hash: string, signal?: AbortSignal) =>
    transactionSchema.parse((await http.get(`/tx/${encodeURIComponent(hash)}`, { signal })).data),
}
