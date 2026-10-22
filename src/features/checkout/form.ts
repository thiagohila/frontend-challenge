import { z } from 'zod'
import { buyerSchema } from '@/contracts/order'
import { networkSchema } from '@/contracts/common'
import { walletTypeSchema } from '@/contracts/wallet'

export const checkoutFormSchema = buyerSchema.extend({
  note: z.string().trim().max(500, 'Máximo de 500 caracteres'),
  walletId: z.string().min(1, 'Selecione uma carteira'),
  network: z.string().pipe(z.enum(networkSchema.options, { error: 'Selecione uma rede' })),
  provider: z.string().pipe(z.enum(walletTypeSchema.options, { error: 'Selecione uma carteira' })),
})
export type CheckoutFormValues = z.input<typeof checkoutFormSchema>
export type CheckoutFormOutput = z.output<typeof checkoutFormSchema>
