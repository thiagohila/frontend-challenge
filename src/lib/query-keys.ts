import type { Network } from '@/contracts/common'
import type { NftListQuery } from '@/contracts/nft'

/**
 * Single source of query keys (ARCHITECTURE §6).
 * Private data is always scoped by owner: ['user', userId, ...] or ['guest', guestId, ...] — never in public keys.
 */
export type Owner = { kind: 'user'; id: string } | { kind: 'guest'; id: string }

const ownerKey = (owner: Owner) => [owner.kind, owner.id] as const

export const queryKeys = {
  nfts: {
    all: ['nfts'] as const,
    lists: () => ['nfts', 'list'] as const,
    list: (query: NftListQuery) => ['nfts', 'list', query] as const,
    featured: () => ['nfts', 'featured'] as const,
    detail: (id: string) => ['nfts', 'detail', id] as const,
    related: (id: string) => ['nfts', 'related', id] as const,
  },
  cart: (owner: Owner) => [...ownerKey(owner), 'cart'] as const,
  quotes: (owner: Owner) => [...ownerKey(owner), 'quote'] as const,
  quote: (owner: Owner, network: Network) => [...ownerKey(owner), 'quote', { network }] as const,
  favorites: (userId: string) => ['user', userId, 'favorites'] as const,
  profile: (userId: string) => ['user', userId, 'profile'] as const,
  wallets: (userId: string) => ['user', userId, 'wallets'] as const,
  orders: {
    all: (userId: string) => ['user', userId, 'orders'] as const,
    pending: (userId: string) => ['user', userId, 'orders', 'pending'] as const,
    detail: (userId: string, orderId: string) => ['user', userId, 'orders', 'detail', orderId] as const,
  },
  transaction: (userId: string, hash: string) => ['user', userId, 'tx', hash] as const,
}
