import { z } from '@/lib/z'
import { id, isoDate, money, networkSchema, quantity } from './common'
import { couponSchema } from './cart'
import { artSchema } from './nft'

export const quoteRequestSchema = z.object({ network: networkSchema })

export const quoteLineSchema = z.object({
  nftId: id,
  editionId: id,
  name: z.string(),
  art: artSchema, // part of the receipt snapshot
  tokenId: z.string(),
  editionLabel: z.string(),
  quantity,
  unitPriceEth: money,
  lineTotalEth: money,
})

export const quoteChangeSchema = z.object({
  nftId: id,
  editionId: id,
  kind: z.enum(['price', 'availability', 'removed']),
  from: z.string(),
  to: z.string(),
})
export type QuoteChange = z.infer<typeof quoteChangeSchema>

export const quoteSchema = z.object({
  quoteId: id,
  network: networkSchema,
  expiresAt: isoDate,
  lines: z.array(quoteLineSchema),
  coupon: couponSchema.nullable(),
  subtotalEth: money,
  discountEth: money,
  networkFeeEth: money,
  networkFeeEstimated: z.boolean(),
  totalEth: money,
  changes: z.array(quoteChangeSchema),
})
export type Quote = z.infer<typeof quoteSchema>
