import type { Network } from '@/contracts/common'
import type { ArtName } from '@/lib/assets.gen'
import type { CollectionSlug, Edition } from '@/contracts/nft'
import type { CouponRecord, DbState, NftRecord, UserRecord, WalletRecord } from './db'
import { createRandom } from './random'

/** Fake credentials (documented in the README). All users share the same demo password. */
export const DEMO_PASSWORD = 'Kurio2026!'
export const DEMO_USERS = {
  ana: { id: 'usr_ana', email: 'ana@kurio.test', username: 'ana.colecionadora', displayName: 'Ana Sato' },
  bruno: { id: 'usr_bruno', email: 'bruno@kurio.test', username: 'bruno.nft', displayName: 'Bruno Lima' },
  /** Restricted account: browses, but purchase and wallet creation answer 403 (ARCHITECTURE §4). */
  carol: { id: 'usr_carol', email: 'carol@kurio.test', username: 'carol.restrita', displayName: 'Carol Reis' },
} as const

const BASE_TIME = Date.parse('2026-10-01T12:00:00Z')
const day = 86_400_000

// The 10 artworks shown in the Figma come first, with their exact names and prices.
const FIGMA_NFTS: { name: string; number: number; art: ArtName; price: string; compareAt?: string; rarity?: 'rare' }[] = [
  { name: 'Emerald Ape', number: 42, art: 'emerald-ape', price: '1.19', rarity: 'rare' },
  { name: 'Sage Nomad', number: 9, art: 'sage-nomad', price: '1.69' },
  { name: 'Neon Vessel', number: 552, art: 'ivory-baron', price: '1.99', compareAt: '2.29' },
  { name: 'Cosmic Bloom', number: 118, art: 'sage-nomad', price: '1.29' },
  { name: 'Violet Nomad', number: 314, art: 'sage-nomad', price: '1.39' },
  { name: 'Ivory Baron', number: 88, art: 'ivory-baron', price: '1.79', rarity: 'rare' },
  { name: 'Golden Beat', number: 207, art: 'golden-beat', price: '0.99' },
  { name: 'Golden Signal', number: 160, art: 'golden-beat', price: '0.39' },
  { name: 'Golden Frequency', number: 71, art: 'golden-beat', price: '0.59' },
  { name: 'Jade Monarch', number: 233, art: 'emerald-ape', price: '2.49' },
]

const ADJECTIVES = ['Amber', 'Velvet', 'Lunar', 'Copper', 'Solar', 'Midnight', 'Crimson', 'Silent', 'Rustic', 'Electric', 'Obsidian', 'Honey']
const NOUNS = ['Ape', 'Nomad', 'Baron', 'Beat', 'Vessel', 'Signal', 'Bloom', 'Echo', 'Drifter', 'Monarch']
const ART_BY_NOUN: Record<string, ArtName> = {
  Ape: 'emerald-ape',
  Monarch: 'emerald-ape',
  Nomad: 'sage-nomad',
  Bloom: 'sage-nomad',
  Drifter: 'sage-nomad',
  Baron: 'ivory-baron',
  Vessel: 'ivory-baron',
  Echo: 'ivory-baron',
  Beat: 'golden-beat',
  Signal: 'golden-beat',
}
const COLLECTIONS: CollectionSlug[] = ['arte-digital', 'fotografia', 'musica', 'arte-3d', 'colecionaveis', 'generativa', 'jogos', 'assinaturas', 'utilidade']
const NETWORKS: Network[] = ['ethereum', 'polygon', 'solana']
const ATTRIBUTES = ['Óculos', 'Esmeralda', 'Raro', 'Chapéu', 'Fones', 'Moletom', 'Dourado', 'Jaqueta', 'Gola alta', 'Edição limitada']
const CREATORS = ['Nova Sato', 'Iris Moreau', 'Kenji Ola', 'Lia Prado']
const TOTAL_NFTS = 45

const pad = (value: number, size: number) => String(value).padStart(size, '0')
const slugify = (name: string, number: number) => `${name.toLowerCase().replace(/\s+/g, '-')}-${pad(number, 3)}`

function buildEditions(index: number, random: ReturnType<typeof createRandom>): Edition[] {
  const id = (label: string) => `ed-${label}`
  // Deterministic special cases used by tests: #1 has the 1/1 sold out; #8 is fully sold out.
  if (index === 0) {
    return [
      { id: id('1-1'), label: '1/1', supply: 1, available: 0 },
      { id: id('1-10'), label: '1/10', supply: 10, available: 3 },
      { id: id('1-50'), label: '1/50', supply: 50, available: 12 },
      { id: id('open'), label: 'ABERTA', supply: null, available: 999 },
    ]
  }
  if (index === 7) {
    return [
      { id: id('1-1'), label: '1/1', supply: 1, available: 0 },
      { id: id('1-10'), label: '1/10', supply: 10, available: 0 },
    ]
  }
  return [
    { id: id('1-1'), label: '1/1', supply: 1, available: random.int(0, 1) },
    { id: id('1-10'), label: '1/10', supply: 10, available: random.int(0, 10) },
    { id: id('1-50'), label: '1/50', supply: 50, available: random.int(5, 50) },
    ...(index % 3 === 0 ? [{ id: id('open'), label: 'ABERTA', supply: null, available: 999 }] : []),
  ]
}

function buildNfts(): NftRecord[] {
  const random = createRandom(2026)
  const specs = [...FIGMA_NFTS]
  while (specs.length < TOTAL_NFTS) {
    const noun = random.pick(NOUNS)
    const name = `${random.pick(ADJECTIVES)} ${noun}`
    const number = random.int(1, 999)
    if (specs.some((spec) => spec.name === name && spec.number === number)) continue
    const price = (random.int(5, 1230) / 100).toFixed(2)
    specs.push({ name, number, art: ART_BY_NOUN[noun] ?? 'emerald-ape', price, ...(random.next() < 0.12 ? { rarity: 'rare' as const } : {}) })
  }

  return specs.map((spec, index) => {
    const editions = buildEditions(index, random)
    const creator = CREATORS[index % CREATORS.length] ?? 'Nova Sato'
    const collection = COLLECTIONS[index % COLLECTIONS.length] ?? 'arte-digital'
    const network = index < 10 ? 'ethereum' : (NETWORKS[index % NETWORKS.length] ?? 'ethereum')
    const listedAt = new Date(BASE_TIME - index * day * 0.75).toISOString()
    return {
      id: slugify(spec.name, spec.number),
      name: spec.name,
      number: spec.number,
      art: spec.art,
      priceEth: spec.price,
      compareAtPriceEth: spec.compareAt ?? null,
      collection,
      network,
      rarity: spec.rarity ?? 'common',
      soldOut: editions.every((edition) => edition.available === 0),
      version: 1,
      tokenId: `#${pad(spec.number, 4)}`,
      series: 'Kurio Apes',
      creator,
      summary: 'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
      description: [
        `${spec.name} #${pad(spec.number, 3)} é uma obra digital finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na rede. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.`,
        `A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. ${creator} recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.`,
      ],
      attributes: [ATTRIBUTES[index % ATTRIBUTES.length] ?? 'Raro', ATTRIBUTES[(index + 3) % ATTRIBUTES.length] ?? 'Dourado', spec.rarity === 'rare' ? 'Raro' : 'Comum'],
      rating: { average: Number((3.8 + random.next() * 1.2).toFixed(1)), count: random.int(3, 60) },
      editions,
      maxPerOrder: 10,
      contract: { address: `0x7A42${pad(index, 4)}19E8${'0'.repeat(28)}`.slice(0, 42), standard: 'ERC-721' },
      royaltyPct: 5,
      metadataStorage: 'IPFS',
      updatedAt: listedAt,
      listedAt,
      trendingScore: random.int(0, 1000),
    }
  })
}

const COUPONS: CouponRecord[] = [
  { code: 'KURIO10', label: 'Desconto do lançamento', percentOff: 10, expiresAt: '2099-12-31T23:59:59Z' },
  { code: 'GENESIS20', label: 'Lançamento gênesis', percentOff: 20, expiresAt: '2026-01-31T23:59:59Z' },
]

function buildWallets(): WalletRecord[] {
  return [
    {
      id: 'wal_ana_primary',
      userId: DEMO_USERS.ana.id,
      role: 'primary',
      displayName: 'Ana Sato',
      alias: 'Principal',
      network: 'ethereum',
      profileName: 'ana.colecionadora',
      address: '0xA91F3c5b7E2d4F6a8B0c1D2e3F4a5B6c7D8eE82C',
      secondaryRef: null,
      walletType: 'metamask',
      referralCode: null,
      email: DEMO_USERS.ana.email,
      ensName: null,
    },
    {
      id: 'wal_ana_secondary',
      userId: DEMO_USERS.ana.id,
      role: 'secondary',
      displayName: 'Ana Sato',
      alias: 'Reserva',
      network: 'polygon',
      profileName: 'ana.colecionadora',
      address: '0x5E3b9A1c7D2e4F6a8B0c1D2e3F4a5B6c7D8e9F10',
      secondaryRef: 'nova.kurio.eth',
      walletType: 'coinbase',
      referralCode: null,
      email: DEMO_USERS.ana.email,
      ensName: 'nova.eth',
    },
    {
      id: 'wal_bruno_primary',
      userId: DEMO_USERS.bruno.id,
      role: 'primary',
      displayName: 'Bruno Lima',
      alias: 'Principal',
      network: 'ethereum',
      profileName: 'bruno.nft',
      address: '0xB0b0000000000000000000000000000000000B0B',
      secondaryRef: null,
      walletType: 'walletconnect',
      referralCode: null,
      email: DEMO_USERS.bruno.email,
      ensName: null,
    },
  ]
}

/**
 * PBKDF2-SHA256 (100k) of DEMO_PASSWORD with each salt, precomputed so a fresh seed does not burn
 * ~300 ms of CPU on every first load. Verified by the unit test "seed hashes match DEMO_PASSWORD".
 */
export const SEED_PASSWORD_HASHES = {
  'seed-salt-0': '1e1f81b84dc69041cca6a8b3f319a1054017400cd750a98d31c6330b1dee34d3',
  'seed-salt-1': 'cac36a356d4e4283a266b3a330fab5efd1d96ce106dd150b3f533fbc49bbb725',
  'seed-salt-2': 'c12de941eba81cbe20b5231182544e63120911c2f3999f494f60ad5ecce425b8',
} as const

function buildUsers(): UserRecord[] {
  const salts = Object.keys(SEED_PASSWORD_HASHES) as (keyof typeof SEED_PASSWORD_HASHES)[]
  return Object.values(DEMO_USERS).map((user, index) => {
    const salt = salts[index] ?? 'seed-salt-0'
    return {
      ...user,
      avatarUrl: null,
      status: user.id === DEMO_USERS.carol.id ? 'restricted' : 'active',
      passwordSalt: salt,
      passwordHash: SEED_PASSWORD_HASHES[salt],
      ensName: null,
      walletAlias: null,
    } satisfies UserRecord
  })
}

export interface SeedOptions {
  /** `empty` scenario: catalog without NFTs (REQUIREMENTS M5 "resultado vazio"). */
  emptyCatalog?: boolean
}

export async function createSeed({ emptyCatalog = false }: SeedOptions = {}): Promise<DbState> {
  return {
    schemaVersion: 1,
    users: buildUsers(),
    sessions: [],
    nfts: emptyCatalog ? [] : buildNfts(),
    favorites: { [DEMO_USERS.ana.id]: ['sage-nomad-009', 'ivory-baron-088'] },
    carts: [],
    coupons: COUPONS,
    quotes: [],
    orders: [],
    wallets: buildWallets(),
    connections: [],
  }
}
