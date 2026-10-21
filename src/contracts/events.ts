import { z } from 'zod'
import { id, isoDate, money } from './common'
import { orderStatusSchema } from './order'

const envelope = <T extends string, P extends z.ZodType>(type: T, payload: P) =>
  z.object({
    eventId: id,
    type: z.literal(type),
    resourceId: id,
    version: z.number().int().min(1),
    occurredAt: isoDate,
    userId: id.optional(),
    payload,
  })

export const nftUpdatedEventSchema = envelope(
  'nft.updated',
  z.object({ priceEth: money, soldOut: z.boolean(), editions: z.array(z.object({ id, available: z.number().int().min(0) })) }),
)
export const orderUpdatedEventSchema = envelope(
  'order.updated',
  z.object({ status: orderStatusSchema, txHash: z.string().nullable(), declineReason: z.string().nullable() }),
)
export const walletDisconnectedEventSchema = envelope(
  'wallet.disconnected',
  z.object({ walletId: id, connectionId: id, reason: z.string() }),
)

export const realtimeEventSchema = z.discriminatedUnion('type', [
  nftUpdatedEventSchema,
  orderUpdatedEventSchema,
  walletDisconnectedEventSchema,
])
export type RealtimeEvent = z.infer<typeof realtimeEventSchema>
export type RealtimeEventType = RealtimeEvent['type']

/** Socket.IO event names (the envelope `type` doubles as the emitted event name). */
export const SOCKET_EVENTS = {
  hello: 'session.hello',
  ready: 'session.ready',
  nftUpdated: 'nft.updated',
  orderUpdated: 'order.updated',
  walletDisconnected: 'wallet.disconnected',
} as const

export const helloPayloadSchema = z.object({ token: z.string() })
export const readyPayloadSchema = z.object({ userId: id.nullable() })
