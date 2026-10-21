import { z } from 'zod'
import { id, isoDate, money, networkSchema } from './common'
import { quoteLineSchema } from './quote'
import { walletTypeSchema } from './wallet'

export const orderStatusSchema = z.enum(['pending', 'confirmed', 'declined'])
export type OrderStatus = z.infer<typeof orderStatusSchema>

export const buyerSchema = z.object({
  displayName: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(40),
  username: z.string().trim().min(3, 'Mínimo de 3 caracteres').max(24),
  email: z.email('E-mail inválido'),
  note: z.string().trim().max(500).nullable(),
})
export type Buyer = z.infer<typeof buyerSchema>

export const createOrderSchema = z.object({ quoteId: id, walletId: id, network: networkSchema, buyer: buyerSchema })
export type CreateOrder = z.infer<typeof createOrderSchema>

/** Immutable snapshot taken at order creation — later catalog changes never alter it. */
export const receiptSchema = z.object({
  lines: z.array(quoteLineSchema),
  subtotalEth: money,
  discountEth: money,
  networkFeeEth: money,
  totalEth: money,
  network: networkSchema,
  walletLabel: z.string(),
  walletType: walletTypeSchema,
})

export const orderSchema = z.object({
  id,
  status: orderStatusSchema,
  version: z.number().int().min(1),
  createdAt: isoDate,
  resolvedAt: isoDate.nullable(),
  declineReason: z.string().nullable(),
  txHash: z.string().nullable(),
  receipt: receiptSchema,
})
export type Order = z.infer<typeof orderSchema>

export const orderListSchema = z.object({ items: z.array(orderSchema) })

export const transactionSchema = z.object({
  hash: z.string(),
  network: networkSchema,
  status: orderStatusSchema,
  totalEth: money,
  confirmedAt: isoDate.nullable(),
})
