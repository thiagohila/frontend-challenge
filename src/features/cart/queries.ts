import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { NftSummary } from '@/contracts/nft'
import { nftDetailQuery } from '@/features/catalog/queries'
import { nftDisplayName } from '@/features/catalog/format'
import { t, translateMessage } from '@/i18n'
import { announce } from '@/lib/announce'
import { isApiError } from '@/lib/api-error'
import type { AddCartItem, Cart } from '@/contracts/cart'
import type { Network } from '@/contracts/common'
import { guestCart } from '@/lib/guest'
import { queryClient } from '@/lib/query-client'
import { type Owner, queryKeys } from '@/lib/query-keys'
import { useSession } from '@/lib/session/store'
import { cartApi } from './api'

/** The cart belongs to the signed-in user, or to the anonymous guest cart (K2, K3). */
export function useCartOwner(): Owner | null {
  const state = useSession()
  // An expired session keeps its owner: screens stay mounted (forms intact) while re-authenticating (A4).
  if (state.status === 'authenticated' || state.status === 'expired') return { kind: 'user', id: state.user.id }
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
        onError: (error) => toast.error(isApiError(error) ? translateMessage(error.message) : t.cart.addFailed),
      },
    )
  }
}

/** Server-side pricing of the cart — the reference for totals and checkout (K5, K8). */
export const quoteQuery = (owner: Owner, network: Network, enabled = true) =>
  queryOptions({
    queryKey: queryKeys.quote(owner, network),
    queryFn: async ({ signal }) => {
      const quote = await cartApi.quote(network, signal)
      // Pricing clamps the server cart to current stock: refresh the lines so they match the summary.
      if (quote.changes.some((change) => change.kind !== 'price')) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.cart(owner) })
      }
      return quote
    },
    staleTime: 0,
    enabled,
  })

/** Quantity, removal and coupon mutations; every success replaces the cart and re-prices (I5). */
export function useCartMutations() {
  const owner = useCartOwner()
  const queryClient = useQueryClient()
  // The mutation ends with the cart response; the quote re-prices in the background (the summary shows
  // it updating) instead of holding every control until a second round trip completes.
  const onCart = (cart: Cart) => {
    if (!owner) return
    queryClient.setQueryData<Cart>(queryKeys.cart(owner), cart)
    void queryClient.invalidateQueries({ queryKey: queryKeys.quotes(owner) })
  }
  // One queue for every cart write: quick clicks on different lines run in order, so an older response
  // can never overwrite a newer cart (no optimistic update needed).
  const scope = { id: 'cart-writes' }
  const onError = (error: unknown) => toast.error(isApiError(error) ? translateMessage(error.message) : t.cart.updateFailed)
  return {
    updateQuantity: useMutation({
      mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => cartApi.update(itemId, quantity),
      scope,
      onSuccess: onCart,
      onError,
    }),
    remove: useMutation({
      mutationFn: (itemId: string) => cartApi.remove(itemId),
      scope,
      onSuccess: (cart) => {
        onCart(cart)
        announce(t.cart.removed)
      },
      onError,
    }),
    applyCoupon: useMutation({ mutationFn: (code: string) => cartApi.applyCoupon(code), scope, onSuccess: onCart }),
    removeCoupon: useMutation({ mutationFn: () => cartApi.removeCoupon(), scope, onSuccess: onCart, onError }),
  }
}
