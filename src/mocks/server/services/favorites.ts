import type { ServerContext } from '../context'
import { findNft, toSummary } from './catalog'

export async function listFavorites(ctx: ServerContext, userId: string) {
  const state = await ctx.db.read()
  const ids = state.favorites[userId] ?? []
  return { items: state.nfts.filter((nft) => ids.includes(nft.id)).map(toSummary) }
}

/** Idempotent: adding twice or removing a missing favorite is a no-op. */
export const setFavorite = (ctx: ServerContext, userId: string, nftId: string, favorite: boolean) =>
  ctx.db.write((state) => {
    findNft(state, nftId)
    const current = new Set(state.favorites[userId] ?? [])
    if (favorite) current.add(nftId)
    else current.delete(nftId)
    state.favorites[userId] = [...current]
    return { nftId, favorite }
  })
