import { z } from '@/lib/z'
import { id, isoDate } from './common'

export const emailSchema = z.email('E-mail inválido').max(120)
export const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Mínimo de 3 caracteres')
  .max(24, 'Máximo de 24 caracteres')
  // A plain name (it is also the display name at sign-up): any letter, accents included, digits and spaces.
  .regex(/^[\p{L}\p{N} ._-]+$/u, 'Use letras, números, espaço, ponto, hífen ou _')
export const passwordSchema = z
  .string()
  .min(8, 'Mínimo de 8 caracteres')
  .max(72, 'Máximo de 72 caracteres')
  .regex(/[a-z]/i, 'Inclua ao menos uma letra')
  .regex(/\d/, 'Inclua ao menos um número')

export const userSchema = z.object({
  id,
  username: z.string(),
  displayName: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
  status: z.enum(['active', 'restricted']),
})
export type User = z.infer<typeof userSchema>

export const loginRequestSchema = z.object({ email: emailSchema, password: z.string().min(1, 'Informe a senha') })
export type LoginRequest = z.infer<typeof loginRequestSchema>

export const registerRequestSchema = z.object({ username: usernameSchema, email: emailSchema, password: passwordSchema })
export type RegisterRequest = z.infer<typeof registerRequestSchema>

/** Client-side form only: adds the confirmation field. */
export const registerFormSchema = registerRequestSchema
  .extend({ confirmPassword: z.string() })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  })

export const sessionResponseSchema = z.object({ token: z.string(), expiresAt: isoDate, user: userSchema })
export type SessionResponse = z.infer<typeof sessionResponseSchema>

export const currentSessionSchema = z.object({ expiresAt: isoDate, user: userSchema })
