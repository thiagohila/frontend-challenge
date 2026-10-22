import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { CartLines } from '@/features/cart/components/CartLines'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { useCart, useCartOwner } from '@/features/cart/queries'
import { RelatedNfts } from '@/features/nft/components/RelatedNfts'
import { t } from '@/i18n'
import { MARKET_ANCHOR } from '@/lib/anchors'
import { Breadcrumb } from '@/components/layout/Breadcrumb'

export const Route = createFileRoute('/cart')({
  head: () => ({ meta: [{ title: t.titles.cart }] }),
  component: CartRoute,
})

function CartRoute() {
  const cart = useCart()
  const owner = useCartOwner()
  const router = useRouter()

  return (
    <div className="mx-auto max-w-page px-4 pt-4 pb-10 lg:px-0 lg:pt-8">
      <div className="mb-6 flex items-center gap-4 lg:mb-0">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label={t.detail.back}
          className="grid size-[30px] shrink-0 place-items-center rounded-full border border-border bg-surface-raised lg:hidden"
        >
          <ChevronLeft aria-hidden className="size-4" />
        </button>
        <h1 className="flex-1 pr-[30px] text-center text-xl font-bold lg:sr-only">{t.cart.title}</h1>
      </div>
      <Breadcrumb className="mb-2" current={t.cart.breadcrumbCart} />

      {cart.isPending || !owner ? (
        <div aria-busy="true" className="flex flex-col gap-3">
          <span className="sr-only">{t.catalog.updating}</span>
          {['a', 'b', 'c'].map((key) => (
            <Skeleton key={key} className="h-[70px] w-full" />
          ))}
        </div>
      ) : cart.isError ? (
        <p role="alert">{t.cart.summaryError}</p>
      ) : cart.data.items.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded bg-card p-6">
          <p>{t.cart.empty}</p>
          <Link to="/" hash={MARKET_ANCHOR} className="text-text-accent underline">
            {t.cart.explore}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 lg:w-[782px]">
            <CartLines items={cart.data.items} />
          </div>
          <CartSummary owner={owner} cart={cart.data} />
        </div>
      )}

      {cart.data?.items[0] && <RelatedNfts nftId={cart.data.items[0].nftId} title={t.cart.alsoViewed} />}
    </div>
  )
}
