import { queryOptions } from '@tanstack/react-query'
import type { Order } from '@/contracts/order'
import { keepNewerVersion } from '@/lib/versioning'
import { queryKeys } from '@/lib/query-keys'
import { ordersApi } from './api'

const PENDING_POLL_MS = 5_000

/** Pending orders also poll (fallback while the socket is down — ARCHITECTURE §9); terminal ones never refetch. */
export const orderQuery = (userId: string, orderId: string) =>
  queryOptions({
    queryKey: queryKeys.orders.detail(userId, orderId),
    queryFn: ({ signal }) => ordersApi.get(orderId, signal),
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? PENDING_POLL_MS : false),
    structuralSharing: keepNewerVersion<Order>,
  })

export const pendingOrdersQuery = (userId: string) =>
  queryOptions({ queryKey: queryKeys.orders.pending(userId), queryFn: ({ signal }) => ordersApi.pending(signal) })

export const transactionQuery = (userId: string, hash: string) =>
  queryOptions({ queryKey: queryKeys.transaction(userId, hash), queryFn: ({ signal }) => ordersApi.transaction(hash, signal) })
