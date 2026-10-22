import { z } from 'zod'
import { emailSchema } from './auth'
import { id, networkSchema } from './common'
import { ensNameSchema } from './profile'

export const walletTypeSchema = z.enum(['metamask', 'walletconnect', 'coinbase'])
export type WalletType = z.infer<typeof walletTypeSchema>

export const walletRoleSchema = z.enum(['primary', 'secondary'])
export type WalletRole = z.infer<typeof walletRoleSchema>

export const walletAddressSchema = z.string().trim().regex(/^0x[a-fA-F0-9]{40}$/, 'Endereço 0x inválido (40 caracteres hex)')

export const walletInputSchema = z.object({
  role: walletRoleSchema,
  displayName: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(40),
  alias: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(30),
  network: networkSchema,
  profileName: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(40),
  address: walletAddressSchema,
  secondaryRef: z.string().trim().max(60).nullable(),
  walletType: walletTypeSchema,
  referralCode: z.string().trim().max(20).nullable(),
  email: emailSchema,
  ensName: ensNameSchema.nullable(),
})
export type WalletInput = z.infer<typeof walletInputSchema>

export const walletSchema = walletInputSchema.extend({ id })
export type Wallet = z.infer<typeof walletSchema>

export const walletListSchema = z.object({ items: z.array(walletSchema) })

export const walletConnectRequestSchema = z.object({ network: networkSchema })

export const walletConnectionSchema = z.object({
  connectionId: id,
  walletId: id,
  network: networkSchema,
  status: z.enum(['connected', 'disconnected']),
})
export type WalletConnection = z.infer<typeof walletConnectionSchema>
