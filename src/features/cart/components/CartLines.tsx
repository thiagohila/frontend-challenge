import { Link } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { NftArt } from '@/components/nft/NftArt'
import { QuantityStepper } from '@/components/nft/QuantityStepper'
import type { CartItem } from '@/contracts/cart'
import { nftDisplayName } from '@/features/catalog/format'
import { t } from '@/i18n'
import { formatEth } from '@/lib/money'
import { useCartMutations } from '../queries'

const maxFor = (item: CartItem) => Math.max(1, Math.min(item.available, item.maxPerOrder))

/** Desktop: table (Figma columns). Mobile: cards. Quantities are bounded by stock per edition (K1). */
export function CartLines({ items }: { items: CartItem[] }) {
  const { updateQuantity, remove } = useCartMutations()
  const busy = updateQuantity.isPending || remove.isPending

  return (
    <>
      <table className="hidden w-full border-separate border-spacing-y-3 lg:table">
        <caption className="sr-only">{t.cart.title}</caption>
        <thead>
          <tr className="text-left text-base font-bold">
            <th scope="col" className="border-b border-border pb-3">
              {t.cart.columns.nft}
            </th>
            <th scope="col" className="border-b border-border pb-3">
              {t.cart.columns.price}
            </th>
            <th scope="col" className="border-b border-border pb-3">
              {t.cart.columns.quantity}
            </th>
            <th scope="col" className="border-b border-border pb-3">
              {t.cart.columns.total}
            </th>
            <th scope="col" className="border-b border-border pb-3">
              <span className="sr-only">{t.cart.remove('')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const name = nftDisplayName(item)
            return (
              <tr key={item.id} className="bg-card" data-testid={`cart-line-${item.nftId}`}>
                <td className="w-[300px] p-0">
                  <div className="flex items-center gap-4">
                    <NftArt art={item.art} alt="" width={70} className="size-[70px] rounded-md" />
                    <div>
                      <Link to="/nft/$nftId" params={{ nftId: item.nftId }} className="font-bold hover:text-text-accent">
                        {name}
                      </Link>
                      <p className="text-sm text-brand-secondary">{t.cart.tokenId(item.tokenId)}</p>
                      <p className="text-xs text-muted-foreground">{t.cart.edition(item.editionLabel)}</p>
                    </div>
                  </div>
                </td>
                <td className="font-bold text-text-accent">{formatEth(item.unitPriceEth)}</td>
                <td>
                  <QuantityStepper
                    value={item.quantity}
                    max={maxFor(item)}
                    label={t.cart.quantityOf(name)}
                    disabled={busy}
                    onChange={(quantity) => updateQuantity.mutate({ itemId: item.id, quantity })}
                  />
                  {item.available < item.quantity && <p className="mt-1 text-xs text-destructive">{t.cart.stockWarning(item.available)}</p>}
                </td>
                <td className="font-bold text-text-accent" data-testid="line-total">
                  {formatEth(item.lineTotalEth)}
                </td>
                <td className="pr-4 text-right">
                  <button
                    type="button"
                    aria-label={t.cart.remove(name)}
                    disabled={busy}
                    onClick={() => remove.mutate(item.id)}
                    className="text-brand-secondary hover:text-destructive"
                  >
                    <Trash2 aria-hidden className="size-5" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <ul className="flex flex-col gap-5 lg:hidden" aria-label={t.cart.title}>
        {items.map((item) => {
          const name = nftDisplayName(item)
          return (
            <li
              key={item.id}
              className="flex gap-3 overflow-hidden rounded-[14px] bg-card shadow-[0_6px_20px_rgba(10,6,4,.45)]"
              data-testid={`cart-card-${item.nftId}`}
            >
              <NftArt art={item.art} alt="" width={100} className="size-[100px] shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-2 pr-3">
                <div className="flex items-start justify-between gap-2">
                  <Link to="/nft/$nftId" params={{ nftId: item.nftId }} className="truncate font-bold">
                    {name}
                  </Link>
                  <button
                    type="button"
                    aria-label={t.cart.remove(name)}
                    disabled={busy}
                    onClick={() => remove.mutate(item.id)}
                    className="shrink-0 text-primary"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
                <p className="text-sm text-brand-secondary">{t.cart.edition(item.editionLabel)}</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-text-accent">{formatEth(item.lineTotalEth)}</p>
                  <QuantityStepper
                    value={item.quantity}
                    max={maxFor(item)}
                    label={t.cart.quantityOf(name)}
                    disabled={busy}
                    onChange={(quantity) => updateQuantity.mutate({ itemId: item.id, quantity })}
                  />
                </div>
                {item.available < item.quantity && <p className="text-xs text-destructive">{t.cart.stockWarning(item.available)}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
