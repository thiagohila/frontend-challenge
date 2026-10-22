import { z } from 'zod'
import { nftSummarySchema } from '@/contracts/nft'
import { http } from '@/lib/http'

const favoritesSchema = z.object({ items: z.array(nftSummarySchema) })

export const favoritesApi = {
  list: async (signal?: AbortSignal) => favoritesSchema.parse((await http.get('/me/favorites', { signal })).data).items,
  add: async (nftId: string) => {
    await http.put(`/me/favorites/${encodeURIComponent(nftId)}`)
  },
  remove: async (nftId: string) => {
    await http.delete(`/me/favorites/${encodeURIComponent(nftId)}`)
  },
}
