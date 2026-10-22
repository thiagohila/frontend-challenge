import { NftArt } from '@/components/nft/NftArt'
import type { Quote } from '@/contracts/quote'
import { t } from '@/i18n'
import { formatEth, money } from '@/lib/money'
import { cn } from '@/lib/utils'

interface OrderLinesProps {
  quote: Quote
  /** Checkout page: the Figma mobile frame shows only "Total:"; lines and breakdown from lg up. */
  totalOnlyOnMobile?: boolean
  /** Review dialog: only the item list scrolls, the totals stay in view. */
  scrollLines?: boolean
}

/** Lines + totals of a quote (checkout) — art comes from the matching cart item. */
export function OrderLines({ quote, totalOnlyOnMobile = false, scrollLines = false }: OrderLinesProps) {
  const desktopOnly = totalOnlyOnMobile && 'max-lg:hidden'
  return (
    <div className={cn('flex flex-col gap-4', scrollLines && 'min-h-0')}>
      {/* -mt-2 cancels the row spacing above the header: "Seus NFTs" → "NFTs" equals "Perfil do colecionador" → first label (measured). */}
      <div className={cn(desktopOnly, scrollLines && 'min-h-0 overflow-y-auto')} data-testid="order-lines">
        <table className="-mt-2 w-full border-separate border-spacing-y-2 text-sm">
          <caption className="sr-only">{t.checkout.yourNfts}</caption>
          <thead>
            <tr className="text-left text-base font-bold">
              <th scope="col" className="border-b border-border pb-1">
                {t.checkout.nfts}
              </th>
              <th scope="col" className="border-b border-border pb-1 text-right">
                {t.checkout.subtotalCol}
              </th>
            </tr>
          </thead>
          <tbody>
            {quote.lines.map((line) => (
              <tr key={`${line.nftId}-${line.editionId}`} className="bg-card">
                <td className="p-1">
                  <div className="flex items-center gap-3">
                    <NftArt art={line.art} alt="" width={66} className="size-[66px] rounded-md" />
                    <div>
                      <p className="font-bold">{line.name}</p>
                      <p className="text-xs text-brand-secondary">{t.cart.tokenId(line.tokenId)}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.cart.edition(line.editionLabel)} {t.checkout.times(line.quantity)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="pr-3 text-right font-bold text-text-accent">{formatEth(line.lineTotalEth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="flex shrink-0 flex-col gap-3 text-base" data-testid="checkout-summary">
        <div className={cn('flex justify-between', desktopOnly)}>
          <dt>{t.cart.subtotal}</dt>
          <dd>{formatEth(quote.subtotalEth)}</dd>
        </div>
        <div className={cn('flex justify-between', desktopOnly)}>
          <dt>{t.cart.discount}</dt>
          <dd>(-) {money.format(quote.discountEth)}</dd>
        </div>
        <div className={cn('flex justify-between', desktopOnly)}>
          <dt>{t.cart.networkFee}</dt>
          <dd className="flex flex-col items-end">
            {formatEth(quote.networkFeeEth)}
            {quote.networkFeeEstimated && <span className="text-xs text-text-accent">{t.cart.estimated}</span>}
          </dd>
        </div>
        <div
          className={cn(
            'flex justify-between border-t border-border pt-3 text-lg font-bold',
            totalOnlyOnMobile && 'max-lg:justify-end max-lg:gap-7 max-lg:border-0 max-lg:pt-0',
          )}
        >
          {/* Figma mobile "Total:" — the colon is presentational. */}
          <dt className={cn(totalOnlyOnMobile && "max-lg:after:content-[':']")}>{t.cart.total}</dt>
          <dd className="text-text-accent" data-testid="checkout-total">
            {formatEth(quote.totalEth)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
