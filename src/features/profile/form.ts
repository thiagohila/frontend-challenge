import { z } from '@/lib/z'
import { emailSchema, passwordSchema, usernameSchema } from '@/contracts/auth'
import type { Profile, ProfileUpdate } from '@/contracts/profile'

const optional = z.string()

/** Profile + optional password change in one "Salvar" (Figma). Password fields are all-or-nothing. */
export const profileFormSchema = z
  .object({
    displayName: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(40, 'Máximo de 40 caracteres'),
    username: usernameSchema,
    email: emailSchema,
    ensLabel: z
      .string()
      .trim()
      // Required in the Figma ("Nome ENS*").
      .regex(/^[a-z0-9-]{3,40}$/i, 'Use 3 a 40 letras, números ou hífen'),
    walletAlias: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(30, 'Máximo de 30 caracteres'),
    currentPassword: optional,
    newPassword: optional,
    confirmPassword: optional,
  })
  .superRefine((value, context) => {
    const changing = Boolean(value.currentPassword || value.newPassword || value.confirmPassword)
    if (!changing) return
    if (!value.currentPassword) context.addIssue({ code: 'custom', path: ['currentPassword'], message: 'Informe a senha atual' })
    const strength = passwordSchema.safeParse(value.newPassword)
    if (!strength.success)
      context.addIssue({ code: 'custom', path: ['newPassword'], message: strength.error.issues[0]?.message ?? 'Senha inválida' })
    if (value.newPassword !== value.confirmPassword)
      context.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'As senhas não coincidem' })
  })
export type ProfileFormValues = z.input<typeof profileFormSchema>
export type ProfileFormOutput = z.output<typeof profileFormSchema>

export const toProfileFormValues = (profile: Profile): ProfileFormValues => ({
  displayName: profile.displayName,
  username: profile.username,
  email: profile.email,
  ensLabel: profile.ensName?.replace(/\.eth$/, '') ?? '',
  walletAlias: profile.walletAlias ?? '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

export const toProfileUpdate = (values: ProfileFormOutput): ProfileUpdate => ({
  displayName: values.displayName,
  username: values.username,
  email: values.email,
  ensName: values.ensLabel ? `${values.ensLabel}.eth` : null,
  walletAlias: values.walletAlias,
})
