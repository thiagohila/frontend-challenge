import { keepPreviousData, queryOptions, replaceEqualDeep } from '@tanstack/react-query'
import type { NftDetail, NftListQuery, NftListResponse } from '@/contracts/nft'
import { queryKeys } from '@/lib/query-keys'
import { keepNewerVersion } from '@/lib/versioning'
import { catalogApi } from './api'

/**
 * Keyed by the exact query + abort signal: a slower response for old params can never
 * overwrite newer results (C4/I6). Previous page stays visible while the next one loads.
 */
export const nftListQuery = (query: NftListQuery) =>
  queryOptions({
    queryKey: queryKeys.nfts.list(query),
    queryFn: ({ signal }) => catalogApi.list(query, signal),
    placeholderData: keepPreviousData,
    structuralSharing: (previous, next) => keepNewerItems(previous as NftListResponse | undefined, next as NftListResponse),
  })

/**
 * Versions never regress (I5, RT3): a REST response started before a realtime event may arrive
 * after it — keep whichever copy of each NFT has the higher version.
 */
function keepNewerItems(previous: NftListResponse | undefined, next: NftListResponse): NftListResponse {
  if (!previous) return next
  const known = new Map(previous.items.map((item) => [item.id, item]))
  const merged = {
    ...next,
    items: next.items.map((item) => {
      const old = known.get(item.id)
      return old && old.version > item.version ? old : item
    }),
  }
  return replaceEqualDeep(previous, merged)
}

export const featuredQuery = () =>
  queryOptions({ queryKey: queryKeys.nfts.featured(), queryFn: ({ signal }) => catalogApi.featured(signal), staleTime: 5 * 60_000 })

export const nftDetailQuery = (id: string) =>
  queryOptions({
    queryKey: queryKeys.nfts.detail(id),
    queryFn: ({ signal }) => catalogApi.detail(id, signal),
    structuralSharing: keepNewerVersion<NftDetail>,
  })

export const relatedQuery = (id: string) =>
  queryOptions({ queryKey: queryKeys.nfts.related(id), queryFn: ({ signal }) => catalogApi.related(id, signal) })
