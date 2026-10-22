import type { QueryClient } from '@tanstack/react-query'
import type { Cart } from '@/contracts/cart'
import type { RealtimeEvent } from '@/contracts/events'
import type { NftDetail, NftListResponse, NftSummary } from '@/contracts/nft'
import type { Order } from '@/contracts/order'
import { money } from '@/lib/money'
import { type Owner, queryKeys } from '@/lib/query-keys'

type NftEvent = Extract<RealtimeEvent, { type: 'nft.updated' }>

const patchSummary = <T extends NftSummary>(nft: T, event: NftEvent): T =>
  nft.id === event.resourceId && event.version > nft.version
    ? { ...nft, priceEth: event.payload.priceEth, soldOut: event.payload.soldOut, version: event.version }
    : nft

function patchDetail(detail: NftDetail | undefined, event: NftEvent): NftDetail | undefined {
  if (!detail || event.version <= detail.version) return detail
  return {
    ...patchSummary(detail, event),
    editions: detail.editions.map((edition) => ({
      ...edition,
      available: event.payload.editions.find((changed) => changed.id === edition.id)?.available ?? edition.available,
    })),
  }
}

function patchCart(cart: Cart | undefined, event: NftEvent): Cart | undefined {
  if (!cart?.items.some((item) => item.nftId === event.resourceId && event.version > item.nftVersion)) return cart
  return {
    ...cart,
    items: cart.items.map((item) => {
      if (item.nftId !== event.resourceId || event.version <= item.nftVersion) return item
      const available = event.payload.editions.find((edition) => edition.id === item.editionId)?.available ?? item.available
      return {
        ...item,
        unitPriceEth: event.payload.priceEth,
        lineTotalEth: money.times(event.payload.priceEth, item.quantity),
        available,
        nftVersion: event.version,
      }
    }),
  }
}

export interface ApplyContext {
  userId: string | null
  cartOwner: Owner | null
}

/** Applies an accepted event to every cache that shows the resource (RT1, RT2). Returns what changed. */
export async function applyEvent(queryClient: QueryClient, event: RealtimeEvent, context: ApplyContext) {
  switch (event.type) {
    case 'nft.updated': {
      // Cancel in-flight refetches so an older REST response cannot overwrite the newer event (I5).
      await queryClient.cancelQueries({ queryKey: queryKeys.nfts.detail(event.resourceId) })
      queryClient.setQueryData<NftDetail>(queryKeys.nfts.detail(event.resourceId), (detail) => patchDetail(detail, event))
      queryClient.setQueriesData<NftListResponse>({ queryKey: queryKeys.nfts.lists() }, (list) =>
        list ? { ...list, items: list.items.map((nft) => patchSummary(nft, event)) } : list,
      )
      queryClient.setQueriesData<NftSummary[]>({ queryKey: queryKeys.nfts.relatedAll() }, (items) =>
        items?.map((nft) => patchSummary(nft, event)),
      )
      if (context.userId) {
        queryClient.setQueryData<NftSummary[]>(queryKeys.favorites(context.userId), (items) =>
          items?.map((nft) => patchSummary(nft, event)),
        )
      }
      let inCart = false
      if (context.cartOwner) {
        const before = queryClient.getQueryData<Cart>(queryKeys.cart(context.cartOwner))
        queryClient.setQueryData<Cart>(queryKeys.cart(context.cartOwner), (cart) => patchCart(cart, event))
        inCart = before?.items.some((item) => item.nftId === event.resourceId) ?? false
        // The quote is the price reference: re-price on the server (K5, RT7).
        if (inCart) await queryClient.invalidateQueries({ queryKey: queryKeys.quotes(context.cartOwner) })
      }
      return { kind: 'nft', nftId: event.resourceId, inCart } as const
    }
    case 'order.updated': {
      if (!context.userId) return { kind: 'ignored' } as const
      queryClient.setQueryData<Order>(queryKeys.orders.detail(context.userId, event.resourceId), (order) =>
        order && event.version > order.version && order.status === 'pending'
          ? {
              ...order,
              status: event.payload.status,
              txHash: event.payload.txHash,
              declineReason: event.payload.declineReason,
              version: event.version,
            }
          : order,
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders.all(context.userId) })
      if (event.payload.status === 'confirmed' && context.cartOwner) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.cart(context.cartOwner) })
      }
      return { kind: 'order', status: event.payload.status } as const
    }
    case 'wallet.disconnected': {
      if (!context.userId) return { kind: 'ignored' } as const
      queryClient.setQueryData(queryKeys.walletConnection(context.userId), null)
      return { kind: 'wallet' } as const
    }
  }
}
