import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
