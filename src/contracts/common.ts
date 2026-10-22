import { z } from '@/lib/z'

/** ETH amount as a decimal string (never a JS number) — up to 18 fractional digits. */
export const money = z.string().regex(/^\d+(\.\d{1,18})?$/, 'Valor ETH inválido')
export type Money = z.infer<typeof money>

export const quantity = z.number().int().positive()
export const isoDate = z.iso.datetime({ offset: true })
export const id = z.string().min(1)

export const networkSchema = z.enum(['ethereum', 'polygon', 'solana'])
export type Network = z.infer<typeof networkSchema>

export const errorCodeSchema = z.enum([
  'VALIDATION',
  'UNAUTHORIZED',
  'SESSION_EXPIRED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'IDEMPOTENCY_CONFLICT',
  'OUT_OF_STOCK',
  'QUOTE_STALE',
  'COUPON_INVALID',
  'COUPON_EXPIRED',
  'WALLET_REJECTED',
  'WALLET_DISCONNECTED',
  'UNAVAILABLE',
])
export type ErrorCode = z.infer<typeof errorCodeSchema>

export const apiErrorBodySchema = z.object({
  error: z.object({
    code: errorCodeSchema,
    message: z.string(),
    fields: z.record(z.string(), z.string()).optional(),
    details: z.unknown().optional(),
  }),
})
export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>

export const paginated = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  })
