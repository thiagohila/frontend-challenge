import { useNavigate } from '@tanstack/react-router'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { QuantityStepper } from '@/components/nft/QuantityStepper'
import { ComingSoon } from '@/components/layout/ComingSoon'
import { Button } from '@/components/ui/button'
import type { NftDetail } from '@/contracts/nft'
import { useAddToCart } from '@/features/cart/queries'
import { nftDisplayName } from '@/features/catalog/format'
import { useFavorites } from '@/features/favorites/queries'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { iconSrc } from '@/lib/assets'
import { isApiError } from '@/lib/api-error'
import { formatEth } from '@/lib/money'
import { cn } from '@/lib/utils'
import { EditionPicker } from './EditionPicker'
import { RatingStars } from './RatingStars'

interface PurchasePanelProps {
  nft: NftDetail
  editionId: string | undefined
  onEditionChange: (editionId: string) => void
}

/** Price, editions, quantity (limited by stock and per-order cap) and the buy/favorite actions (S5, C5). */
export function PurchasePanel({ nft, editionId, onEditionChange }: PurchasePanelProps) {
  const name = nftDisplayName(nft)
  const navigate = useNavigate()
  const favorites = useFavorites()
  const addToCart = useAddToCart()
  const firstAvailable = nft.editions.find((edition) => edition.available > 0)
  const requested = nft.editions.find((edition) => edition.id === editionId)
  const edition = requested ?? firstAvailable
  const max = edition ? Math.min(edition.available, nft.maxPerOrder) : 0
  const [quantity, setQuantity] = useState(1)
  const clamped = Math.max(1, Math.min(quantity, max))
  const unavailable = !edition || edition.available === 0
  const isFavorite = favorites.isFavorite(nft.id)

  const add = (then: 'cart' | 'stay') => {
    if (!edition || unavailable) return
    addToCart.mutate(
      { nftId: nft.id, editionId: edition.id, quantity: clamped },
      {
        onSuccess: () => {
          const message = t.cart.added(name, clamped)
          announce(message)
          if (then === 'cart') void navigate({ to: '/cart' })
          else toast.success(message)
        },
        onError: (error) => toast.error(isApiError(error) ? error.message : t.cart.addFailed),
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 border-b border-border pb-4">
        <h1 className="text-[28px] leading-8 font-bold">{name}</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="hidden text-[22px] font-bold text-text-accent lg:block">{formatEth(nft.priceEth)}</p>
          <RatingStars average={nft.rating.average} count={nft.rating.count} />
        </div>
      </div>

      <section aria-labelledby="about-title" className="flex flex-col gap-3">
        <h2 id="about-title" className="text-[15px] font-bold">
          {t.detail.about}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{nft.summary}</p>
      </section>

      <EditionPicker editions={nft.editions} selectedId={edition?.id} onSelect={onEditionChange} />
      {requested && requested.available === 0 && (
        <p role="alert" className="text-sm text-destructive">
          {t.detail.editionUnavailable}
        </p>
      )}
      {!firstAvailable && <p className="text-sm text-destructive">{t.detail.allSoldOut}</p>}

      {/* Desktop actions (Figma: stepper left, COMPRAR + Favoritar right). */}
      <div className="hidden items-center justify-between gap-4 lg:flex">
        <QuantityStepper value={clamped} max={Math.max(max, 1)} onChange={setQuantity} label={t.detail.quantity} disabled={unavailable} />
        <div className="flex gap-2">
          <Button onClick={() => add('cart')} disabled={unavailable || addToCart.isPending} className="h-10 w-[115px] rounded-md text-sm font-bold">
            {addToCart.isPending ? t.detail.adding : t.detail.buy}
          </Button>
          <Button
            variant="outline"
            aria-pressed={isFavorite}
            onClick={() => favorites.toggle(nft)}
            className="h-10 gap-2 rounded-md border-primary bg-transparent text-sm text-text-accent hover:bg-surface-raised"
          >
            <Heart aria-hidden className={cn('size-4', isFavorite && 'fill-primary')} />
            {isFavorite ? t.detail.favorited : t.detail.favorite}
          </Button>
        </div>
      </div>
      {max > 0 && clamped >= max && <p className="text-xs text-muted-foreground">{t.detail.limit(max)}</p>}

      <dl className="flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="flex gap-1">
          <dt>{t.detail.tokenId}</dt>
          <dd>{nft.tokenId}</dd>
        </div>
        <div className="flex gap-1">
          <dt>{t.detail.collection}</dt>
          <dd>{nft.series}</dd>
        </div>
        <div className="flex gap-1">
          <dt>{t.detail.attributes}</dt>
          <dd>{nft.attributes.join(', ')}</dd>
        </div>
      </dl>
      <div className="hidden items-center gap-3 text-sm font-bold lg:flex">
        {t.detail.share}
        {(['social-linkedin', 'icon-share-mail', 'social-twitter'] as const).map((icon) => (
          <ComingSoon key={icon} aria-label={t.detail.shareOn(icon.replace(/^(social|icon-share)-/, ''))} className="grid size-5 place-items-center">
            <img src={iconSrc(icon)} alt="" width={16} height={16} />
          </ComingSoon>
        ))}
      </div>

      {/* Mobile buy bar (Figma): fixed at the bottom with quantity, price and CTAs. */}
      <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-[31px] bg-card px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_0_10px_rgba(10,6,4,.45)] lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-sm text-muted-foreground">
              {t.detail.quantityShort}
            </span>
            <QuantityStepper value={clamped} max={Math.max(max, 1)} onChange={setQuantity} label={t.detail.quantity} disabled={unavailable} />
          </div>
          <p className="text-xl font-bold text-text-accent">{formatEth(nft.priceEth)}</p>
        </div>
        <div className="mt-4 flex gap-3">
          <Button
            onClick={() => add('cart')}
            disabled={unavailable || addToCart.isPending}
            className="h-[60px] flex-1 rounded-full bg-[linear-gradient(105deg,#d28a4c_4%,rgba(210,138,76,.8)_122%)] text-base font-bold"
          >
            {addToCart.isPending ? t.detail.adding : t.detail.buyMobile}
          </Button>
          <Button
            variant="outline"
            onClick={() => add('stay')}
            disabled={unavailable || addToCart.isPending}
            aria-label={t.cart.addToCart}
            className="size-[60px] rounded-full border-border bg-surface-raised text-text-accent"
          >
            <ShoppingCart aria-hidden className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
