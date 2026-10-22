import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Network } from '@/contracts/common'
import type { CreateOrder, Order } from '@/contracts/order'
import { z } from 'zod'
import { type Quote, quoteSchema } from '@/contracts/quote'
import type { WalletType } from '@/contracts/wallet'
import { ordersApi } from '@/features/orders/api'
import { walletsApi } from '@/features/wallets/api'
import { ApiError, isApiError } from '@/lib/api-error'
import { type Owner, queryKeys } from '@/lib/query-keys'
import { checkoutAttempt } from './attempt'

export interface ActiveConnection {
  walletId: string
  connectionId: string
  network: Network
  provider: WalletType
}

/** Simulated wallet connection (P3). A `wallet.disconnected` event sets it back to null (realtime/apply). */
export function useWalletConnection(userId: string) {
  const queryClient = useQueryClient()
  const key = queryKeys.walletConnection(userId)
  const connection = useQuery<ActiveConnection | null>({
    queryKey: key,
    queryFn: () => null,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
  const connect = useMutation({
    mutationFn: async ({ walletId, network, provider }: { walletId: string; network: Network; provider: WalletType }) => {
      const result = await walletsApi.connect(walletId, network)
      return { walletId, connectionId: result.connectionId, network, provider } satisfies ActiveConnection
    },
    onSuccess: (active) => queryClient.setQueryData(key, active),
  })
  const disconnect = useMutation({
    mutationFn: (walletId: string) => walletsApi.disconnect(walletId),
    onSettled: () => queryClient.setQueryData(key, null),
  })
  return { connection: connection.data ?? null, connect, disconnect }
}

// Error `details` are untrusted server data: parsed, never cast.
const staleDetailsSchema = z.object({ quote: quoteSchema })
const conflictDetailsSchema = z.object({ orderId: z.string() })

export type PlaceOrderResult = { kind: 'created'; order: Order } | { kind: 'pending'; orderId: string }

export class StaleQuoteError extends Error {
  override readonly name = 'StaleQuoteError'
  readonly quote: Quote
  constructor(quote: Quote) {
    super('quote is stale')
    this.quote = quote
  }
}

/**
 * Places the order safely (P4, P5, I8):
 * - an already pending order is resumed instead of creating another;
 * - the Idempotency-Key is stable per (user, quote): retries/timeouts return the same order;
 * - a timeout is retried once automatically with the same key (the order may already exist);
 * - a stale quote surfaces the fresh one and requires a new confirmation.
 */
export function usePlaceOrder(userId: string, owner: Owner) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateOrder): Promise<PlaceOrderResult> => {
      const [pending] = await ordersApi.pending()
      if (pending) return { kind: 'pending', orderId: pending.id }

      const key = checkoutAttempt.keyFor(userId, input.quoteId)
      const attempt = () => ordersApi.create(input, key)
      try {
        return {
          kind: 'created',
          order: await attempt().catch((error: unknown) =>
            isApiError(error) && error.reason === 'timeout' ? attempt() : Promise.reject(error),
          ),
        }
      } catch (error) {
        if (!(error instanceof ApiError)) throw error
        if (error.code === 'QUOTE_STALE') {
          const stale = staleDetailsSchema.safeParse(error.details)
          if (stale.success) {
            queryClient.setQueryData(queryKeys.quote(owner, input.network), stale.data.quote)
            throw new StaleQuoteError(stale.data.quote)
          }
          await queryClient.invalidateQueries({ queryKey: queryKeys.quotes(owner) })
        }
        if (error.code === 'CONFLICT') {
          const conflict = conflictDetailsSchema.safeParse(error.details)
          if (conflict.success) return { kind: 'pending', orderId: conflict.data.orderId }
        }
        throw error
      }
    },
    onSuccess: (result) => {
      if (result.kind === 'created') queryClient.setQueryData(queryKeys.orders.detail(userId, result.order.id), result.order)
    },
  })
}
