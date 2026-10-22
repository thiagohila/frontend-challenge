import { featuredResponseSchema, nftDetailSchema, type NftListQuery, nftListResponseSchema, relatedResponseSchema } from '@/contracts/nft'
import { http } from '@/lib/http'

export const catalogApi = {
  list: async (query: NftListQuery, signal?: AbortSignal) =>
    // `indexes: null` → collection=a&collection=b (repeated keys, as the API expects).
    nftListResponseSchema.parse((await http.get('/nfts', { params: query, paramsSerializer: { indexes: null }, signal })).data),
  featured: async (signal?: AbortSignal) => featuredResponseSchema.parse((await http.get('/nfts/featured', { signal })).data),
  detail: async (id: string, signal?: AbortSignal) => nftDetailSchema.parse((await http.get(`/nfts/${encodeURIComponent(id)}`, { signal })).data),
  related: async (id: string, signal?: AbortSignal) =>
    relatedResponseSchema.parse((await http.get(`/nfts/${encodeURIComponent(id)}/related`, { signal })).data).items,
}
