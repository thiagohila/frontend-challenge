import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart, useCartOwner } from '@/features/cart/queries'
import { CheckoutView } from '@/features/checkout/components/CheckoutView'
import { profileQuery } from '@/features/profile/queries'
import { walletsQuery } from '@/features/wallets/queries'
import { t } from '@/i18n'
import { useSessionUser } from '@/lib/session/store'
import { MARKET_ANCHOR } from '@/lib/anchors'

export const Route = createFileRoute('/_auth/checkout')({
  head: () => ({ meta: [{ title: t.titles.checkout }] }),
  component: CheckoutRoute,
})

function CheckoutRoute() {
  const user = useSessionUser()
  const owner = useCartOwner()
  const router = useRouter()
  const cart = useCart()
  const wallets = useQuery({ ...walletsQuery(user?.id ?? ''), enabled: Boolean(user) })
  const profile = useQuery({ ...profileQuery(user?.id ?? ''), enabled: Boolean(user) })
  const failed = cart.isError || wallets.isError || profile.isError

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
        <h1 className="flex-1 text-xl font-bold lg:sr-only">{t.checkout.mobileTitle}</h1>
      </div>
      <nav aria-label={t.detail.breadcrumb} className="mb-6 hidden text-[15px] font-bold lg:block">
        <ol className="flex gap-1">
          <li>
            <Link to="/">{t.detail.home}</Link> /
          </li>
          <li>
            <Link to="/" hash={MARKET_ANCHOR}>
              {t.detail.market}
            </Link>{' '}
            /
          </li>
          <li aria-current="page">{t.checkout.breadcrumb}</li>
        </ol>
      </nav>

      {failed ? (
        <div role="alert" className="flex items-center gap-4">
          {t.checkout.loadError}
          <Button variant="outline" onClick={() => void Promise.all([cart.refetch(), wallets.refetch(), profile.refetch()])}>
            {t.cart.retry}
          </Button>
        </div>
      ) : user && owner && cart.data && wallets.data && profile.data ? (
        <CheckoutView userId={user.id} owner={owner} cart={cart.data} wallets={wallets.data} profile={profile.data} />
      ) : (
        <div aria-busy="true" className="flex flex-col gap-4 lg:flex-row">
          <span className="sr-only">{t.catalog.updating}</span>
          <Skeleton className="h-96 w-full lg:w-[763px]" />
          <Skeleton className="h-96 w-full lg:w-[405px]" />
        </div>
      )}
    </div>
  )
}
