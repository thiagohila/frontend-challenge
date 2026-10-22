import { NftArt } from '@/components/nft/NftArt'
import type { Quote } from '@/contracts/quote'
import { t } from '@/i18n'
import { formatEth, money } from '@/lib/money'

/** Lines + totals of a quote (checkout) — art comes from the matching cart item. */
export function OrderLines({ quote }: { quote: Quote }) {
  return (
    <div className="flex flex-col gap-4">
      <table className="w-full border-separate border-spacing-y-2 text-sm">
        <caption className="sr-only">{t.checkout.yourNfts}</caption>
        <thead>
          <tr className="text-left text-base font-bold">
            <th scope="col">{t.checkout.nfts}</th>
            <th scope="col" className="text-right">
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
      <dl className="flex flex-col gap-3 text-base" data-testid="checkout-summary">
        <div className="flex justify-between">
          <dt>{t.cart.subtotal}</dt>
          <dd>{formatEth(quote.subtotalEth)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{t.cart.discount}</dt>
          <dd>(-) {money.format(quote.discountEth)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{t.cart.networkFee}</dt>
          <dd className="flex flex-col items-end">
            {formatEth(quote.networkFeeEth)}
            {quote.networkFeeEstimated && <span className="text-xs text-text-accent">{t.cart.estimated}</span>}
          </dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
          <dt>{t.cart.total}</dt>
          <dd className="text-text-accent" data-testid="checkout-total">
            {formatEth(quote.totalEth)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
