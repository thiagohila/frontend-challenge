import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { NftSummary } from '@/contracts/nft'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { queryKeys } from '@/lib/query-keys'
import { useSession } from '@/lib/session/store'
import { nftDisplayName as displayName } from '@/features/catalog/format'
import { favoritesApi } from './api'

export const favoritesQuery = (userId: string) =>
  queryOptions({ queryKey: queryKeys.favorites(userId), queryFn: ({ signal }) => favoritesApi.list(signal) })

/**
 * Favorites with optimistic update + rollback (I10). `isFavorite` is derived from the private
 * favorites query — never written into the public NFT cache (ARCHITECTURE §6, X4).
 * Visitors are sent to sign in and the action resumes afterwards (intent).
 */
export function useFavorites() {
  const state = useSession()
  const userId = state.status === 'authenticated' ? state.user.id : null
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const favorites = useQuery({ ...favoritesQuery(userId ?? ''), enabled: Boolean(userId) })
  const ids = new Set(favorites.data?.map((nft) => nft.id))

  const mutation = useMutation({
    mutationFn: ({ nft, favorite }: { nft: NftSummary; favorite: boolean }) =>
      favorite ? favoritesApi.add(nft.id) : favoritesApi.remove(nft.id),
    onMutate: async ({ nft, favorite }) => {
      if (!userId) return { previous: undefined }
      const key = queryKeys.favorites(userId)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<NftSummary[]>(key)
      queryClient.setQueryData<NftSummary[]>(key, (current = []) =>
        favorite ? [...current.filter((item) => item.id !== nft.id), nft] : current.filter((item) => item.id !== nft.id),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (userId && context?.previous) queryClient.setQueryData(queryKeys.favorites(userId), context.previous)
      toast.error(t.favorites.failed)
      announce(t.favorites.failed)
    },
    onSuccess: (_data, { nft, favorite }) =>
      announce(favorite ? t.favorites.added(displayName(nft)) : t.favorites.removed(displayName(nft))),
    onSettled: () => (userId ? queryClient.invalidateQueries({ queryKey: queryKeys.favorites(userId) }) : undefined),
  })

  return {
    isFavorite: (nftId: string) => ids.has(nftId),
    isPending: (nftId: string) => mutation.isPending && mutation.variables?.nft.id === nftId,
    toggle(nft: NftSummary) {
      if (!userId) {
        void navigate({ to: '/login', search: { redirect: location.href, intent: `favorite:${nft.id}` } })
        return
      }
      mutation.mutate({ nft, favorite: !ids.has(nft.id) })
    },
  }
}
