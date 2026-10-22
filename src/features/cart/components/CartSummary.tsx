import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Cart } from '@/contracts/cart'
import type { Quote } from '@/contracts/quote'
import { t } from '@/i18n'
import { formatEth, money } from '@/lib/money'
import type { Owner } from '@/lib/query-keys'
import { quoteQuery } from '../queries'
import { QuoteError } from './QuoteError'
import { CouponForm } from './CouponForm'

/** Totals come from the server quote (K5); realtime price/stock changes re-price and are listed (RT7). */
export function CartSummary({ owner, cart }: { owner: Owner; cart: Cart }) {
  const quote = useQuery(quoteQuery(owner, 'ethereum', cart.items.length > 0))

  return (
    <aside
      aria-labelledby="summary-title"
      className="flex flex-col gap-5 rounded-t-[31px] bg-card p-6 lg:w-[332px] lg:rounded-none lg:bg-transparent lg:p-0"
    >
      <h2 id="summary-title" className="hidden border-b border-border pb-3 text-lg font-bold lg:block">
        {t.cart.summaryTitle}
      </h2>
      <CouponForm coupon={cart.coupon} />
      {quote.isPending ? (
        <div aria-busy="true" className="flex flex-col gap-3" data-testid="summary-skeleton">
          <span className="sr-only">{t.catalog.updating}</span>
          {['subtotal', 'discount', 'fee', 'total'].map((key) => (
            <Skeleton key={key} className="h-5 w-full" />
          ))}
        </div>
      ) : quote.isError ? (
        <QuoteError error={quote.error} onRetry={() => void quote.refetch()} />
      ) : (
        <QuoteValues quote={quote.data} updating={quote.isFetching} />
      )}
      <Button
        asChild
        className="h-[60px] rounded-full bg-[linear-gradient(105deg,#d28a4c_4%,rgba(210,138,76,.8)_122%)] text-base font-bold lg:h-10 lg:rounded-[3px] lg:bg-primary lg:bg-none"
      >
        <Link to="/checkout">{t.cart.checkout}</Link>
      </Button>
      <Link to="/" hash="catalogo" className="hidden text-center text-base text-text-accent hover:underline lg:block">
        {t.cart.continue}
      </Link>
    </aside>
  )
}

function QuoteValues({ quote, updating }: { quote: Quote; updating: boolean }) {
  return (
    <div className="flex flex-col gap-4" aria-busy={updating}>
      {quote.changes.length > 0 && (
        <output className="block rounded border border-primary/60 bg-primary/10 p-3 text-sm" data-testid="quote-changes">
          <p className="font-bold">{t.cart.changesTitle}</p>
          <ul className="mt-1 list-disc pl-4">
            {quote.changes.map((change) => (
              <li key={`${change.nftId}-${change.editionId}-${change.kind}`}>
                {change.kind === 'price'
                  ? t.cart.change.price(change.name, formatEth(change.from), formatEth(change.to))
                  : change.kind === 'availability'
                    ? t.cart.change.availability(change.name, change.from, change.to)
                    : t.cart.change.removed(change.name)}
              </li>
            ))}
          </ul>
        </output>
      )}
      <dl className="flex flex-col gap-4 text-base" data-testid="cart-summary">
        <SummaryRow term={t.cart.subtotal} value={formatEth(quote.subtotalEth)} />
        <SummaryRow term={t.cart.discount} value={`(-) ${money.format(quote.discountEth)}`} />
        <div className="flex justify-between">
          <dt>{t.cart.networkFee}</dt>
          <dd className="flex flex-col items-end">
            {formatEth(quote.networkFeeEth)}
            {quote.networkFeeEstimated && <span className="text-xs text-text-accent">{t.cart.estimated}</span>}
          </dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-4 text-lg font-bold">
          <dt>{t.cart.total}</dt>
          <dd className="text-text-accent" data-testid="cart-total">
            {formatEth(quote.totalEth)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

function SummaryRow({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt>{term}</dt>
      <dd>{value}</dd>
    </div>
  )
}
