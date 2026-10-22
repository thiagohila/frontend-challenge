import type { PasswordChange, Profile, ProfileUpdate } from '@/contracts/profile'
import { hashPassword, randomSalt, verifyPassword } from '../crypto'
import type { ServerContext } from '../context'
import type { UserRecord } from '../db'
import { HttpError, notFound, validation } from '../errors'
import { toUser } from './auth'

const toProfile = (user: UserRecord): Profile => ({
  displayName: user.displayName,
  username: user.username,
  email: user.email,
  ensName: user.ensName,
  walletAlias: user.walletAlias,
  avatarUrl: user.avatarUrl,
})

export const getProfile = async (ctx: ServerContext, userId: string) => {
  const user = (await ctx.db.read()).users.find((candidate) => candidate.id === userId)
  if (!user) throw notFound('Perfil')
  return toProfile(user)
}

export const updateProfile = (ctx: ServerContext, userId: string, input: ProfileUpdate) =>
  ctx.db.write((state) => {
    const user = state.users.find((candidate) => candidate.id === userId)
    if (!user) throw notFound('Perfil')
    const others = state.users.filter((candidate) => candidate.id !== userId)
    const fields: Record<string, string> = {}
    if (others.some((other) => other.username.toLowerCase() === input.username.toLowerCase()))
      fields.username = 'Nome de usuário já está em uso'
    if (others.some((other) => other.email === input.email.toLowerCase())) fields.email = 'E-mail já cadastrado'
    if (Object.keys(fields).length) throw new HttpError(409, 'CONFLICT', 'Dados já usados por outra conta.', { fields })
    Object.assign(user, { ...input, email: input.email.toLowerCase() })
    return { profile: toProfile(user), user: toUser(user) }
  })

export const setAvatar = (ctx: ServerContext, userId: string, dataUrl: string | null) =>
  ctx.db.write((state) => {
    const user = state.users.find((candidate) => candidate.id === userId)
    if (!user) throw notFound('Perfil')
    user.avatarUrl = dataUrl
    return { profile: toProfile(user), user: toUser(user) }
  })

export async function changePassword(ctx: ServerContext, userId: string, input: PasswordChange) {
  const user = (await ctx.db.read()).users.find((candidate) => candidate.id === userId)
  if (!user) throw notFound('Perfil')
  if (!(await verifyPassword(input.currentPassword, user.passwordSalt, user.passwordHash))) {
    throw validation({ currentPassword: 'Senha atual incorreta' })
  }
  const salt = randomSalt()
  const passwordHash = await hashPassword(input.newPassword, salt)
  await ctx.db.write((state) => {
    const record = state.users.find((candidate) => candidate.id === userId)
    if (record) Object.assign(record, { passwordSalt: salt, passwordHash })
  })
}
