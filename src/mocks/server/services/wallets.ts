import type { Network } from '@/contracts/common'
import type { Wallet, WalletInput } from '@/contracts/wallet'
import { bus, newEventId } from '../bus'
import { iso, newId, type ServerContext } from '../context'
import type { UserRecord, WalletRecord } from '../db'
import { HttpError, notFound } from '../errors'
import { requireActive } from './auth'

const toWallet = ({ userId: _userId, ...wallet }: WalletRecord): Wallet => wallet

const roleTaken = () =>
  new HttpError(409, 'CONFLICT', 'Você já tem uma carteira com esse papel.', { fields: { role: 'Já existe uma carteira com esse papel' } })

export async function listWallets(ctx: ServerContext, userId: string) {
  const state = await ctx.db.read()
  return { items: state.wallets.filter((wallet) => wallet.userId === userId).map(toWallet) }
}

export const createWallet = (ctx: ServerContext, user: UserRecord, input: WalletInput) =>
  ctx.db.write((state) => {
    requireActive(user)
    if (state.wallets.some((wallet) => wallet.userId === user.id && wallet.role === input.role)) throw roleTaken()
    const wallet: WalletRecord = { ...input, id: newId('wal'), userId: user.id }
    state.wallets.push(wallet)
    return toWallet(wallet)
  })

export const updateWallet = (ctx: ServerContext, user: UserRecord, walletId: string, input: WalletInput) =>
  ctx.db.write((state) => {
    const wallet = state.wallets.find((candidate) => candidate.id === walletId && candidate.userId === user.id)
    if (!wallet) throw notFound('Carteira')
    if (state.wallets.some((other) => other.userId === user.id && other.id !== walletId && other.role === input.role)) throw roleTaken()
    Object.assign(wallet, input)
    return toWallet(wallet)
  })

/** Simulated wallet extension handshake: connect, user refusal and later disconnection (P3). */
export const connectWallet = (ctx: ServerContext, user: UserRecord, walletId: string, network: Network) =>
  ctx.db.write((state) => {
    const wallet = state.wallets.find((candidate) => candidate.id === walletId && candidate.userId === user.id)
    if (!wallet) throw notFound('Carteira')
    if (ctx.flags.walletRejects) throw new HttpError(403, 'WALLET_REJECTED', 'A conexão foi recusada na carteira.')
    state.connections = state.connections.filter((connection) => connection.walletId !== walletId)
    const connection = { connectionId: newId('conn'), walletId, userId: user.id, network, status: 'connected' as const }
    state.connections.push(connection)
    if (ctx.flags.walletDisconnectsAfterMs) {
      ctx.schedule(() => void disconnectWallet(ctx, user.id, walletId, 'A carteira foi desconectada.'), ctx.flags.walletDisconnectsAfterMs)
    }
    const { userId: _userId, ...view } = connection
    return view
  })

export const disconnectWallet = (ctx: ServerContext, userId: string, walletId: string, reason = 'Desconectada pelo usuário.') =>
  ctx.db.write((state) => {
    const connection = state.connections.find((candidate) => candidate.walletId === walletId && candidate.userId === userId)
    if (!connection || connection.status === 'disconnected') return
    connection.status = 'disconnected'
    bus.publish({
      eventId: newEventId(),
      type: 'wallet.disconnected',
      resourceId: walletId,
      version: 1,
      occurredAt: iso(ctx.now()),
      userId,
      payload: { walletId, connectionId: connection.connectionId, reason },
    })
  })
