import type { LoginRequest, RegisterRequest, SessionResponse, User } from '@/contracts/auth'
import { hashPassword, randomSalt, verifyPassword } from '../crypto'
import { iso, newId, type ServerContext } from '../context'
import type { DbState, UserRecord } from '../db'
import { HttpError, forbidden, sessionExpired, unauthorized } from '../errors'

const SESSION_TTL_MS = 60 * 60_000

export const toUser = ({ id, username, displayName, email, avatarUrl, status }: UserRecord): User => ({
  id,
  username,
  displayName,
  email,
  avatarUrl,
  status,
})

function createSession(ctx: ServerContext, state: DbState, user: UserRecord): SessionResponse {
  const token = `tok_${crypto.randomUUID()}`
  const expiresAt = iso(ctx.now() + (ctx.flags.sessionTtlMs ?? SESSION_TTL_MS))
  state.sessions.push({ token, userId: user.id, expiresAt })
  return { token, expiresAt, user: toUser(user) }
}

export async function register(ctx: ServerContext, input: RegisterRequest): Promise<SessionResponse> {
  const salt = randomSalt()
  const passwordHash = await hashPassword(input.password, salt)
  return ctx.db.write((state) => {
    const email = input.email.toLowerCase()
    const fields: Record<string, string> = {}
    if (ctx.flags.registerConflict || state.users.some((user) => user.username.toLowerCase() === input.username.toLowerCase())) {
      fields.username = 'Nome de usuário já está em uso'
    }
    if (state.users.some((user) => user.email === email)) fields.email = 'E-mail já cadastrado'
    if (Object.keys(fields).length) throw new HttpError(409, 'CONFLICT', 'Já existe uma conta com esses dados.', { fields })

    const user: UserRecord = {
      id: newId('usr'),
      username: input.username,
      displayName: input.username,
      email,
      avatarUrl: null,
      status: 'active',
      passwordSalt: salt,
      passwordHash,
      ensName: null,
      walletAlias: null,
    }
    state.users.push(user)
    return createSession(ctx, state, user)
  })
}

export async function login(ctx: ServerContext, input: LoginRequest): Promise<SessionResponse> {
  const state = await ctx.db.read()
  const user = state.users.find((candidate) => candidate.email === input.email.toLowerCase())
  // Same message for unknown e-mail and wrong password (no account enumeration).
  const invalid = new HttpError(401, 'UNAUTHORIZED', 'E-mail ou senha incorretos.')
  if (!user || !(await verifyPassword(input.password, user.passwordSalt, user.passwordHash))) throw invalid
  return ctx.db.write((draft) => createSession(ctx, draft, user))
}

export const logout = (ctx: ServerContext, token: string) =>
  ctx.db.write((state) => {
    state.sessions = state.sessions.filter((candidate) => candidate.token !== token)
  })

/** Resolves the caller from the bearer token — the only source of identity (X4). */
export async function authenticate(ctx: ServerContext, token: string | null): Promise<UserRecord> {
  if (!token) throw unauthorized()
  const state = await ctx.db.read()
  const record = state.sessions.find((candidate) => candidate.token === token)
  if (!record) throw sessionExpired()
  if (Date.parse(record.expiresAt) <= ctx.now()) {
    await ctx.db.write((draft) => {
      draft.sessions = draft.sessions.filter((candidate) => candidate.token !== token)
    })
    throw sessionExpired()
  }
  const user = state.users.find((candidate) => candidate.id === record.userId)
  if (!user) throw sessionExpired()
  return user
}

export async function currentSession(ctx: ServerContext, token: string | null) {
  const user = await authenticate(ctx, token)
  const state = await ctx.db.read()
  const record = state.sessions.find((candidate) => candidate.token === token)
  return { expiresAt: record?.expiresAt ?? iso(ctx.now()), user: toUser(user) }
}

export const requireActive = (user: UserRecord) => {
  if (user.status !== 'active') throw forbidden()
}

/** Control API: invalidate every session of a user (next call → 401 SESSION_EXPIRED). */
export const expireSessions = (ctx: ServerContext, userId?: string) =>
  ctx.db.write((state) => {
    state.sessions = userId ? state.sessions.filter((session) => session.userId !== userId) : []
  })
