import { z } from '@/lib/z'
import { emailSchema } from '@/contracts/auth'
import { networkSchema } from '@/contracts/common'
import { type Wallet, type WalletInput, type WalletRole, walletAddressSchema, walletTypeSchema } from '@/contracts/wallet'

const required = (min: number, max: number) =>
  z.string().trim().min(min, `Mínimo de ${min} caracteres`).max(max, `Máximo de ${max} caracteres`)

/** Form shape (strings only); converted to the API contract on submit. */
export const walletFormSchema = z.object({
  displayName: required(2, 40),
  alias: required(2, 30),
  // Input is a plain string (empty = nothing selected); output is the enum.
  network: z.string().pipe(z.enum(networkSchema.options, { error: 'Selecione uma rede' })),
  profileName: required(2, 40),
  address: walletAddressSchema,
  secondaryRef: z.string().trim().max(60, 'Máximo de 60 caracteres'),
  walletType: z.string().pipe(z.enum(walletTypeSchema.options, { error: 'Selecione uma carteira' })),
  // Marked required in the Figma, but a referral code is optional by nature (ARCHITECTURE §15).
  referralCode: z.string().trim().max(20, 'Máximo de 20 caracteres'),
  email: emailSchema,
  ensLabel: z
    .string()
    .trim()
    .regex(/^([a-z0-9-]{3,40})?$/i, 'Use 3 a 40 letras, números ou hífen'),
})
export type WalletFormValues = z.input<typeof walletFormSchema>

const orNull = (value: string) => (value.trim() ? value.trim() : null)

export function toWalletInput(role: WalletRole, values: z.output<typeof walletFormSchema>): WalletInput {
  return {
    role,
    displayName: values.displayName,
    alias: values.alias,
    network: values.network,
    profileName: values.profileName,
    address: values.address,
    secondaryRef: orNull(values.secondaryRef),
    walletType: values.walletType,
    referralCode: orNull(values.referralCode),
    email: values.email,
    ensName: values.ensLabel ? `${values.ensLabel}.eth` : null,
  }
}

export function toFormValues(wallet: Wallet | undefined, email = ''): WalletFormValues {
  return {
    displayName: wallet?.displayName ?? '',
    alias: wallet?.alias ?? '',
    network: wallet?.network ?? '',
    profileName: wallet?.profileName ?? '',
    address: wallet?.address ?? '',
    secondaryRef: wallet?.secondaryRef ?? '',
    walletType: wallet?.walletType ?? '',
    referralCode: wallet?.referralCode ?? '',
    email: wallet?.email ?? email,
    ensLabel: wallet?.ensName?.replace(/\.eth$/, '') ?? '',
  }
}
