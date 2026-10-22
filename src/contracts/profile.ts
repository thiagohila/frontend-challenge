import { z } from '@/lib/z'
import { emailSchema, passwordSchema, usernameSchema } from './auth'

export const ensNameSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]{3,40}\.eth$/i, 'Nome ENS inválido (ex.: nova.eth)')

export const profileSchema = z.object({
  displayName: z.string(),
  username: z.string(),
  email: z.string(),
  ensName: z.string().nullable(),
  walletAlias: z.string().nullable(),
  avatarUrl: z.string().nullable(),
})
export type Profile = z.infer<typeof profileSchema>

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(40, 'Máximo de 40 caracteres'),
  username: usernameSchema,
  email: emailSchema,
  ensName: ensNameSchema.nullable(),
  walletAlias: z.string().trim().min(2, 'Mínimo de 2 caracteres').max(30, 'Máximo de 30 caracteres'),
})
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>

export const AVATAR_MAX_BYTES = 200 * 1024
export const avatarUpdateSchema = z.object({
  dataUrl: z
    .string()
    .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, 'Formato de imagem não suportado')
    .refine((value) => value.length * 0.75 <= AVATAR_MAX_BYTES, 'Imagem acima de 200 KB'),
})

export const passwordChangeSchema = z.object({ currentPassword: z.string().min(1, 'Informe a senha atual'), newPassword: passwordSchema })
export type PasswordChange = z.infer<typeof passwordChangeSchema>
