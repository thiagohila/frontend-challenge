import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { NftArt } from '@/components/nft/NftArt'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Order } from '@/contracts/order'
import { checkoutAttempt } from '@/features/checkout/attempt'
import { t } from '@/i18n'
import { iconSrc } from '@/lib/assets'
import { formatDate } from '@/lib/format'
import { formatEth, money } from '@/lib/money'
import { type Owner, queryKeys } from '@/lib/query-keys'
import { orderQuery } from '../queries'

const short = (hash: string) => `${hash.slice(0, 6)}…${hash.slice(-4)}`

/**
 * Pending → confirmed (receipt) or declined, driven only by the server (REST + `order.updated`) — X3/P7.
 * The receipt renders the order's immutable snapshot, never the current catalog (P9).
 */
export function OrderView({ userId, orderId, cartOwner }: { userId: string; orderId: string; cartOwner: Owner | null }) {
  const order = useQuery(orderQuery(userId, orderId))
  const queryClient = useQueryClient()
  const status = order.data?.status

  useEffect(() => {
    if (status !== 'confirmed' && status !== 'declined') return
    checkoutAttempt.clear(userId)
    // The server removed the purchased items / released the stock: refresh what depends on it (P8).
    void queryClient.invalidateQueries({ queryKey: queryKeys.nfts.all })
    if (cartOwner) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart(cartOwner) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.quotes(cartOwner) })
    }
  }, [status, userId, cartOwner, queryClient])

  if (order.isPending) {
    return (
      <div aria-busy="true" className="mx-auto flex w-full max-w-[578px] flex-col gap-4">
        <span className="sr-only">{t.catalog.updating}</span>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }
  if (order.isError) {
    return (
      <div role="alert" className="text-center">
        <h1 className="text-2xl font-bold">{t.order.notFound}</h1>
        <Link to="/" className="mt-4 inline-block text-text-accent underline">
          {t.notFound.back}
        </Link>
      </div>
    )
  }
  if (order.data.status === 'pending') return <PendingOrder />
  if (order.data.status === 'declined') return <DeclinedOrder order={order.data} />
  return <Receipt order={order.data} />
}

function PendingOrder() {
  return (
    <section
      aria-labelledby="order-title"
      className="mx-auto flex max-w-[578px] flex-col items-center gap-4 rounded-lg bg-card p-10 text-center"
      data-testid="order-pending"
    >
      <Loader2 aria-hidden className="size-10 animate-spin text-primary motion-reduce:animate-none" />
      <h1 id="order-title" className="text-xl font-bold">
        {t.order.pendingTitle}
      </h1>
      <p className="text-sm text-muted-foreground">{t.order.pendingBody}</p>
    </section>
  )
}

function DeclinedOrder({ order }: { order: Order }) {
  return (
    <section
      role="alert"
      aria-labelledby="order-title"
      className="mx-auto flex max-w-[578px] flex-col items-center gap-4 rounded-lg border border-destructive/60 bg-card p-10 text-center"
      data-testid="order-declined"
    >
      <h1 id="order-title" className="text-xl font-bold text-destructive">
        ✕ {t.order.declinedTitle}
      </h1>
      {order.declineReason && <p className="text-sm">{order.declineReason}</p>}
      <p className="text-sm text-muted-foreground">{t.order.declinedBody}</p>
      <Button asChild>
        <Link to="/checkout">{t.order.backToCheckout}</Link>
      </Button>
    </section>
  )
}

function Receipt({ order }: { order: Order }) {
  const { receipt } = order
  return (
    <section
      aria-labelledby="order-title"
      className="relative mx-auto w-full max-w-[578px] bg-card pb-2.5 after:absolute after:inset-x-0 after:bottom-0 after:h-2.5 after:bg-primary"
      data-testid="order-confirmed"
    >
      <div className="flex flex-col items-center gap-4 px-6 pt-6 pb-5">
        <img src={iconSrc('illustration-thank-you')} alt="" width={66} height={80} />
        <h1 id="order-title" className="text-center text-base font-bold text-muted-foreground">
          {t.order.confirmedTitle}
        </h1>
      </div>
      <dl className="grid grid-cols-2 gap-4 border-y border-primary px-6 py-4 text-sm sm:grid-cols-4 sm:divide-x sm:divide-primary">
        <ReceiptFact term={t.order.txId} value={order.txHash ? short(order.txHash) : '—'} />
        <ReceiptFact term={t.order.date} value={formatDate(order.resolvedAt ?? order.createdAt)} />
        <ReceiptFact term={t.order.total} value={formatEth(receipt.totalEth)} />
        <ReceiptFact term={t.order.wallet} value={`${receipt.walletLabel} · ${t.walletTypes[receipt.walletType]}`} />
      </dl>
      <div className="flex flex-col gap-4 px-6 py-5 sm:px-11">
        <h2 className="text-base font-bold">{t.order.details}</h2>
        <table className="w-full text-sm">
          <caption className="sr-only">{t.order.details}</caption>
          <thead>
            <tr className="border-b border-border text-left text-base font-bold">
              <th scope="col" className="pb-2">
                {t.checkout.nfts}
              </th>
              <th scope="col" className="pb-2 text-center">
                {t.order.editions}
              </th>
              <th scope="col" className="pb-2 text-right">
                {t.checkout.subtotalCol}
              </th>
            </tr>
          </thead>
          <tbody>
            {receipt.lines.map((line) => (
              <tr key={`${line.nftId}-${line.editionId}`}>
                <td className="py-2">
                  <div className="flex items-center gap-3">
                    <NftArt art={line.art} alt="" width={66} className="size-[66px] rounded-lg" />
                    <div>
                      <p className="font-bold">{line.name}</p>
                      <p className="text-xs text-brand-secondary">{t.cart.tokenId(line.tokenId)}</p>
                    </div>
                  </div>
                </td>
                <td className="text-center">{t.checkout.times(line.quantity)}</td>
                <td className="text-right font-bold text-text-accent">{formatEth(line.lineTotalEth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="ml-auto flex w-full max-w-[320px] flex-col gap-2 text-sm" data-testid="receipt-totals">
          {money.compare(receipt.discountEth, '0') > 0 && (
            <div className="flex justify-between">
              <dt>{t.order.discount}</dt>
              <dd>(-) {money.format(receipt.discountEth)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>{t.order.networkFee}</dt>
            <dd>{formatEth(receipt.networkFeeEth)}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2 text-base font-bold">
            <dt>{t.order.total}</dt>
            <dd className="text-text-accent" data-testid="receipt-total">
              {formatEth(receipt.totalEth)}
            </dd>
          </div>
        </dl>
        <p className="text-center text-sm text-muted-foreground">{t.order.message(t.networks[receipt.network])}</p>
        <div className="flex flex-col items-center gap-3">
          {order.txHash && (
            <Button asChild className="h-12 px-4 font-bold">
              <Link to="/tx/$hash" params={{ hash: order.txHash }}>
                {t.order.explorer}
              </Link>
            </Button>
          )}
          <Link to="/" hash="catalogo" className="text-sm text-text-accent hover:underline">
            {t.order.continue}
          </Link>
        </div>
      </div>
    </section>
  )
}

function ReceiptFact({ term, value }: { term: string; value: string }) {
  return (
    <div className="sm:px-3 sm:first:pl-0">
      <dt className="font-bold text-muted-foreground">{term}</dt>
      <dd className="text-muted-foreground">{value}</dd>
    </div>
  )
}
