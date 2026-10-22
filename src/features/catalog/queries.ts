import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { NftListQuery } from '@/contracts/nft'
import { queryKeys } from '@/lib/query-keys'
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
  })

export const featuredQuery = () =>
  queryOptions({ queryKey: queryKeys.nfts.featured(), queryFn: ({ signal }) => catalogApi.featured(signal), staleTime: 5 * 60_000 })

export const nftDetailQuery = (id: string) =>
  queryOptions({ queryKey: queryKeys.nfts.detail(id), queryFn: ({ signal }) => catalogApi.detail(id, signal) })

export const relatedQuery = (id: string) =>
  queryOptions({ queryKey: queryKeys.nfts.related(id), queryFn: ({ signal }) => catalogApi.related(id, signal) })
