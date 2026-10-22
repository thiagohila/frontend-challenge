import { useNavigate } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { QuantityStepper } from '@/components/nft/QuantityStepper'
import { Button } from '@/components/ui/button'
import type { NftDetail } from '@/contracts/nft'
import { useAddToCart, useCart } from '@/features/cart/queries'
import { nftDisplayName } from '@/features/catalog/format'
import { useFavorites } from '@/features/favorites/queries'
import { t, translateMessage } from '@/i18n'
import { announce } from '@/lib/announce'
import { isApiError } from '@/lib/api-error'
import { formatEth } from '@/lib/money'
import { cn } from '@/lib/utils'
import { EditionPicker } from './EditionPicker'
import { MobileBuyBar } from './MobileBuyBar'
import { NftFacts, ShareLinks } from './NftFacts'
import { RatingPill, RatingStars } from './RatingStars'

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
  const cart = useCart()
  const firstAvailable = nft.editions.find((edition) => edition.available > 0)
  const requested = nft.editions.find((edition) => edition.id === editionId)
  const edition = requested ?? firstAvailable
  const limit = edition ? Math.min(edition.available, nft.maxPerOrder) : 0
  // The server caps the cart's total per edition, so what is already in the cart counts (K1).
  const inCart = cart.data?.items.find((item) => item.nftId === nft.id && item.editionId === edition?.id)?.quantity ?? 0
  const max = Math.max(limit - inCart, 0)
  const [quantity, setQuantity] = useState(1)
  const clamped = Math.max(1, Math.min(quantity, max))
  const cartFull = limit > 0 && max === 0
  const unavailable = !edition || edition.available === 0 || cartFull
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
        onError: (error) => toast.error(isApiError(error) ? translateMessage(error.message) : t.cart.addFailed),
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:border-b lg:border-border lg:pb-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl leading-8 font-bold lg:text-[28px]">{name}</h1>
          <RatingPill average={nft.rating.average} count={nft.rating.count} className="lg:hidden" />
        </div>
        <div className="hidden flex-wrap items-center justify-between gap-3 lg:flex">
          <p className="text-[22px] font-bold text-text-accent">{formatEth(nft.priceEth)}</p>
          <RatingStars average={nft.rating.average} count={nft.rating.count} />
        </div>
      </div>

      <section aria-labelledby="about-title" className="flex flex-col gap-3">
        {/* The mobile frame shows the summary without a heading: kept for screen readers. */}
        <h2 id="about-title" className="text-[15px] font-bold max-lg:sr-only">
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
          <Button
            onClick={() => add('cart')}
            disabled={unavailable || addToCart.isPending}
            className="h-10 w-[130px] rounded-md text-sm font-bold"
          >
            {addToCart.isPending ? t.detail.adding : t.detail.buy}
          </Button>
          <Button
            variant="outline"
            aria-pressed={isFavorite}
            onClick={() => favorites.toggle(nft)}
            className="h-10 w-[130px] gap-2 rounded-md border-primary bg-transparent text-sm text-text-accent hover:bg-surface-raised"
          >
            <Heart aria-hidden className={cn('size-4', isFavorite && 'fill-primary')} />
            {isFavorite ? t.detail.favorited : t.detail.favorite}
          </Button>
        </div>
      </div>
      {cartFull ? (
        <p className="text-sm text-muted-foreground" data-testid="cart-limit">
          {t.detail.cartFull(limit)}
        </p>
      ) : (
        max > 0 &&
        clamped >= max && (
          <p className="text-xs text-muted-foreground">{inCart > 0 ? t.detail.limitWithCart(limit, inCart) : t.detail.limit(limit)}</p>
        )
      )}
      <NftFacts nft={nft} />
      <ShareLinks />
      <MobileBuyBar
        quantity={clamped}
        max={Math.max(max, 1)}
        onQuantityChange={setQuantity}
        priceEth={nft.priceEth}
        disabled={unavailable}
        pending={addToCart.isPending}
        onBuy={() => add('cart')}
        onAddToCart={() => add('stay')}
      />
    </div>
  )
}
