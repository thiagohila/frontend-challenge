import { HttpResponse } from 'msw'
import { loginRequestSchema, registerRequestSchema } from '@/contracts/auth'
import { avatarUpdateSchema, passwordChangeSchema, profileUpdateSchema } from '@/contracts/profile'
import { walletConnectRequestSchema, walletInputSchema } from '@/contracts/wallet'
import { serverContext as ctx } from '../server/browser-context'
import { currentSession, login, logout, register } from '../server/services/auth'
import { changePassword, getProfile, setAvatar, updateProfile } from '../server/services/profile'
import { connectWallet, createWallet, disconnectWallet, listWallets, updateWallet } from '../server/services/wallets'
import { route } from './route'

export const accountHandlers = [
  route('post', '/auth/register', async ({ body }) => HttpResponse.json(await register(ctx, await body(registerRequestSchema)), { status: 201 })),
  route('post', '/auth/login', async ({ body }) => login(ctx, await body(loginRequestSchema))),
  route('get', '/auth/session', ({ token }) => currentSession(ctx, token)),
  route('post', '/auth/logout', async ({ token }) => {
    if (token) await logout(ctx, token)
    return new HttpResponse(null, { status: 204 })
  }),

  route('get', '/me/profile', async ({ user }) => getProfile(ctx, (await user()).id), { private: true }),
  route('patch', '/me/profile', async ({ user, body }) => updateProfile(ctx, (await user()).id, await body(profileUpdateSchema)), { private: true }),
  route('put', '/me/avatar', async ({ user, body }) => setAvatar(ctx, (await user()).id, (await body(avatarUpdateSchema)).dataUrl), { private: true }),
  route('delete', '/me/avatar', async ({ user }) => setAvatar(ctx, (await user()).id, null), { private: true }),
  route(
    'post',
    '/me/password',
    async ({ user, body }) => {
      await changePassword(ctx, (await user()).id, await body(passwordChangeSchema))
      return new HttpResponse(null, { status: 204 })
    },
    { private: true },
  ),

  route('get', '/me/wallets', async ({ user }) => listWallets(ctx, (await user()).id), { private: true }),
  route(
    'post',
    '/me/wallets',
    async ({ user, body }) => HttpResponse.json(await createWallet(ctx, await user(), await body(walletInputSchema)), { status: 201 }),
    { private: true },
  ),
  route('patch', '/me/wallets/:id', async ({ user, params, body }) => updateWallet(ctx, await user(), String(params.id), await body(walletInputSchema)), {
    private: true,
  }),
  route(
    'post',
    '/me/wallets/:id/connect',
    async ({ user, params, body }) => connectWallet(ctx, await user(), String(params.id), (await body(walletConnectRequestSchema)).network),
    { private: true },
  ),
  route(
    'delete',
    '/me/wallets/:id/connect',
    async ({ user, params }) => {
      await disconnectWallet(ctx, (await user()).id, String(params.id))
      return new HttpResponse(null, { status: 204 })
    },
    { private: true },
  ),
]
