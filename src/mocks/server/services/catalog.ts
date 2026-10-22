import type { NftDetail, NftListQuery, NftListResponse, NftSummary } from '@/contracts/nft'
import { money } from '@/lib/money'
import { bus, newEventId } from '../bus'
import { iso, type ServerContext } from '../context'
import type { DbState, NftRecord } from '../db'
import { notFound } from '../errors'

const DEFAULT_PAGE_SIZE = 9
const NEW_RELEASES_DAYS = 14

export function toSummary(nft: NftRecord): NftSummary {
  const { id, name, number, art, priceEth, compareAtPriceEth, collection, network, rarity, soldOut, version } = nft
  return { id, name, number, art, priceEth, compareAtPriceEth, collection, network, rarity, soldOut, version }
}

export function toDetail(nft: NftRecord): NftDetail {
  const { listedAt: _listedAt, trendingScore: _trendingScore, ...detail } = nft
  return detail
}

export function findNft(state: DbState, id: string): NftRecord {
  const nft = state.nfts.find((candidate) => candidate.id === id)
  if (!nft) throw notFound('NFT')
  return nft
}

const matchesText = (nft: NftRecord, q: string) => {
  const needle = q.toLowerCase()
  return [nft.name, `#${nft.number}`, nft.series, nft.creator].some((value) => value.toLowerCase().includes(needle))
}

export async function listNfts(ctx: ServerContext, query: NftListQuery): Promise<NftListResponse> {
  const state = await ctx.db.read()
  const page = query.page ?? 1
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE
  const newSince = ctx.now() - NEW_RELEASES_DAYS * 86_400_000

  // Facet counts reflect every filter except their own dimension (standard faceted search).
  const base = state.nfts.filter((nft) => {
    if (query.q && !matchesText(nft, query.q)) return false
    if (query.priceMin && money.compare(nft.priceEth, query.priceMin) < 0) return false
    if (query.priceMax && money.compare(nft.priceEth, query.priceMax) > 0) return false
    if (query.tab === 'new' && Date.parse(nft.listedAt) < newSince) return false
    if (query.tab === 'trending' && nft.trendingScore < 500) return false
    return true
  })
  const byCollection = (nft: NftRecord) => !query.collection?.length || query.collection.includes(nft.collection)
  const byNetwork = (nft: NftRecord) => !query.network?.length || query.network.includes(nft.network)
  const filtered = base.filter((nft) => byCollection(nft) && byNetwork(nft))

  const sorted = [...filtered].sort((a, b) => {
    switch (query.sort ?? 'recent') {
      case 'price-asc':
        return money.compare(a.priceEth, b.priceEth) || a.id.localeCompare(b.id)
      case 'price-desc':
        return money.compare(b.priceEth, a.priceEth) || a.id.localeCompare(b.id)
      case 'rating':
        return b.rating.average - a.rating.average || a.id.localeCompare(b.id)
      default:
        return Date.parse(b.listedAt) - Date.parse(a.listedAt) || a.id.localeCompare(b.id)
    }
  })

  const total = sorted.length
  const totalPages = Math.ceil(total / pageSize)
  const count = <K extends 'collection' | 'network'>(key: K, items: NftRecord[]) => {
    const counts = new Map<NftRecord[K], number>()
    for (const nft of items) counts.set(nft[key], (counts.get(nft[key]) ?? 0) + 1)
    return [...counts].map(([value, total]) => ({ value, count: total }))
  }
  const prices = state.nfts.map((nft) => nft.priceEth).sort(money.compare)

  return {
    items: sorted.slice((page - 1) * pageSize, page * pageSize).map(toSummary),
    page,
    pageSize,
    total,
    totalPages,
    facets: {
      collections: count('collection', base.filter(byNetwork)),
      networks: count('network', base.filter(byCollection)),
      price: { min: prices[0] ?? money.zero, max: prices.at(-1) ?? money.zero },
    },
  }
}

export async function featured(ctx: ServerContext) {
  const state = await ctx.db.read()
  const [first, second, third, fourth] = state.nfts
  if (!first) throw notFound('Destaque')
  return {
    hero: [first, second, third].filter((nft): nft is NftRecord => Boolean(nft)).map(toSummary),
    spotlight: toSummary(fourth ?? first),
  }
}

export async function nftDetail(ctx: ServerContext, id: string) {
  return toDetail(findNft(await ctx.db.read(), id))
}

export async function related(ctx: ServerContext, id: string) {
  const state = await ctx.db.read()
  const nft = findNft(state, id)
  const items = state.nfts.filter((candidate) => candidate.id !== id && candidate.art === nft.art).slice(0, 5)
  const filler = state.nfts.filter((candidate) => candidate.id !== id && !items.includes(candidate))
  return { items: [...items, ...filler].slice(0, 5).map(toSummary) }
}

export interface NftPatch {
  priceEth?: string
  editions?: { id: string; available: number }[]
}

/** Single write path for catalog changes: bumps the version and publishes `nft.updated` (M9, RT3). */
export function applyNftPatch(ctx: ServerContext, state: DbState, id: string, patch: NftPatch) {
  const nft = findNft(state, id)
  if (patch.priceEth) nft.priceEth = patch.priceEth
  for (const change of patch.editions ?? []) {
    const edition = nft.editions.find((candidate) => candidate.id === change.id)
    if (edition) edition.available = Math.max(0, change.available)
  }
  nft.soldOut = nft.editions.every((edition) => edition.available === 0)
  nft.version += 1
  nft.updatedAt = iso(ctx.now())
  bus.publish({
    eventId: newEventId(),
    type: 'nft.updated',
    resourceId: nft.id,
    version: nft.version,
    occurredAt: nft.updatedAt,
    payload: {
      priceEth: nft.priceEth,
      soldOut: nft.soldOut,
      editions: nft.editions.map(({ id: editionId, available }) => ({ id: editionId, available })),
    },
  })
  return nft
}

export const updateNft = (ctx: ServerContext, id: string, patch: NftPatch) =>
  ctx.db.write((state) => toDetail(applyNftPatch(ctx, state, id, patch)))
