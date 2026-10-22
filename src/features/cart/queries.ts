import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { NftSummary } from '@/contracts/nft'
import { nftDetailQuery } from '@/features/catalog/queries'
import { nftDisplayName } from '@/features/catalog/format'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { isApiError } from '@/lib/api-error'
import type { AddCartItem, Cart } from '@/contracts/cart'
import { guestCart } from '@/lib/guest'
import { type Owner, queryKeys } from '@/lib/query-keys'
import { useSession } from '@/lib/session/store'
import { cartApi } from './api'

/** The cart belongs to the signed-in user, or to the anonymous guest cart (K2, K3). */
export function useCartOwner(): Owner | null {
  const state = useSession()
  if (state.status === 'authenticated') return { kind: 'user', id: state.user.id }
  if (state.status === 'anonymous') return { kind: 'guest', id: guestCart.id() }
  return null
}

export const cartQuery = (owner: Owner) => queryOptions({ queryKey: queryKeys.cart(owner), queryFn: ({ signal }) => cartApi.get(signal) })

export function useCart() {
  const owner = useCartOwner()
  return useQuery({ ...cartQuery(owner ?? { kind: 'guest', id: 'pending' }), enabled: Boolean(owner) })
}

export function useAddToCart() {
  const owner = useCartOwner()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AddCartItem) => cartApi.add(input),
    onSuccess: (cart) => {
      if (!owner) return
      queryClient.setQueryData<Cart>(queryKeys.cart(owner), cart)
      return queryClient.invalidateQueries({ queryKey: queryKeys.quotes(owner) })
    },
  })
}

/** Card "add to cart": first edition still in stock, quantity 1, with accessible feedback. */
export function useQuickAddToCart() {
  const queryClient = useQueryClient()
  const addToCart = useAddToCart()
  return async (nft: NftSummary) => {
    const detail = await queryClient.fetchQuery(nftDetailQuery(nft.id))
    const edition = detail.editions.find((candidate) => candidate.available > 0)
    if (!edition) return
    addToCart.mutate(
      { nftId: nft.id, editionId: edition.id, quantity: 1 },
      {
        onSuccess: () => {
          const message = t.cart.added(nftDisplayName(nft), 1)
          toast.success(message)
          announce(message)
        },
        onError: (error) => toast.error(isApiError(error) ? error.message : t.cart.addFailed),
      },
    )
  }
}
