import type { User } from '@/contracts/auth'
import type { Coupon } from '@/contracts/cart'
import type { Network } from '@/contracts/common'
import type { NftDetail } from '@/contracts/nft'
import type { Order } from '@/contracts/order'
import type { Quote } from '@/contracts/quote'
import type { Wallet, WalletConnection } from '@/contracts/wallet'

/** Server-side records (what a real backend would store). Never read by the app. */
export interface UserRecord extends User {
  passwordHash: string
  passwordSalt: string
  ensName: string | null
  walletAlias: string | null
}

export interface SessionRecord {
  token: string
  userId: string
  expiresAt: string
}

export interface NftRecord extends NftDetail {
  listedAt: string
  trendingScore: number
}

export interface CartRecord {
  id: string
  ownerKey: string // `user:<id>` | `guest:<id>`
  items: { id: string; nftId: string; editionId: string; quantity: number }[]
  couponCode: string | null
}

export interface CouponRecord extends Coupon {
  expiresAt: string
}

export interface QuoteRecord extends Quote {
  ownerKey: string
}

export interface OrderRecord extends Order {
  userId: string
  idempotencyKey: string
  requestHash: string
  quoteId: string
  plannedOutcome: 'confirmed' | 'declined'
  resolveAt: string
  reservations: { nftId: string; editionId: string; quantity: number }[]
}

export interface WalletRecord extends Wallet {
  userId: string
}

export interface ConnectionRecord extends WalletConnection {
  userId: string
  network: Network
}

export interface DbState {
  schemaVersion: 1
  /** Fee overrides set through the control API (absent = the default table). */
  networkFees?: Partial<Record<Network, string>>
  users: UserRecord[]
  sessions: SessionRecord[]
  nfts: NftRecord[]
  favorites: Record<string, string[]> // userId -> nftIds
  carts: CartRecord[]
  coupons: CouponRecord[]
  quotes: QuoteRecord[]
  orders: OrderRecord[]
  wallets: WalletRecord[]
  connections: ConnectionRecord[]
}

export interface Persistence {
  load(): DbState | null
  save(state: DbState): void
  clear(): void
}

export const memoryPersistence = (): Persistence => {
  let saved: DbState | null = null
  return {
    load: () => (saved ? structuredClone(saved) : null),
    save: (state) => {
      saved = structuredClone(state)
    },
    clear: () => {
      saved = null
    },
  }
}

/**
 * The simulated backend's database. Every mutation goes through `write`, which persists
 * the state — the mock survives reloads (REQUIREMENTS M2) and `reset` restores the seed.
 */
export function createDb(persistence: Persistence, seed: () => Promise<DbState>) {
  let state: DbState | null = null

  async function ensure(): Promise<DbState> {
    if (state) return state
    state = persistence.load() ?? (await seed())
    persistence.save(state)
    return state
  }

  return {
    read: ensure,
    async write<T>(mutate: (draft: DbState) => T): Promise<T> {
      const draft = await ensure()
      try {
        return mutate(draft)
      } finally {
        // Saved even when the mutation then rejects the request: server-side effects that already
        // happened (stock clamp, a scenario's price race + its event) must survive a reload.
        persistence.save(draft)
      }
    },
    async reset() {
      persistence.clear()
      state = await seed()
      persistence.save(state)
    },
  }
}

export type Db = ReturnType<typeof createDb>
