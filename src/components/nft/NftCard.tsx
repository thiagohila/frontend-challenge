import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Heart, Search, ShoppingCart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { NftSummary } from '@/contracts/nft'
import { nftDisplayName } from '@/features/catalog/format'
import { t } from '@/i18n'
import { formatEth } from '@/lib/money'
import { cn } from '@/lib/utils'
import { NftArt } from './NftArt'

interface NftCardProps {
  nft: NftSummary
  isFavorite: boolean
  onToggleFavorite: (nft: NftSummary) => void
  onQuickAdd?: (nft: NftSummary) => void
  priority?: boolean
}

const actionClass =
  'grid size-[35px] place-items-center rounded border border-border bg-surface-raised text-foreground hover:border-primary hover:text-text-accent disabled:opacity-50'

/**
 * Figma card: art over a surface panel, name + price; hover/focus reveals the 3 actions
 * (cart, favorite, view) and a primary top border. Visible on touch as the favorite button.
 */
export function NftCard({ nft, isFavorite, onToggleFavorite, onQuickAdd, priority }: NftCardProps) {
  const name = nftDisplayName(nft)
  // Bumped only when the user favorites (not on data refresh): restarts the burst animation via `key`.
  const [burst, setBurst] = useState(0)
  const toggleFavorite = () => {
    if (!isFavorite) setBurst((count) => count + 1)
    onToggleFavorite(nft)
  }
  return (
    <article className="group relative flex flex-col gap-3" aria-labelledby={`nft-${nft.id}`}>
      <div className="relative overflow-hidden rounded-[20px] border-t border-transparent bg-card pt-6 pb-1 transition-[border-color] group-focus-within:border-primary group-hover:border-primary lg:overflow-visible lg:rounded-none">
        <NftArt art={nft.art} alt={name} width={250} priority={priority} className="mx-auto w-[calc(100%-8px)] rounded-[15px]" />
        {nft.rarity === 'rare' && (
          <span className="absolute top-0 left-0 z-10 bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
            {t.catalog.rare}
          </span>
        )}
        {nft.soldOut && (
          <span className="absolute top-2 right-2 rounded bg-ink/80 px-2 py-1 text-xs font-bold text-foreground">{t.catalog.soldOut}</span>
        )}
        {burst > 0 && (
          // Decorative feedback (the live region announces the change); no motion → no burst.
          <span
            key={burst}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-6 bottom-1 grid place-items-center motion-reduce:hidden"
          >
            <Heart className="size-20 animate-heart-burst fill-primary text-primary opacity-0 drop-shadow-lg" />
          </span>
        )}
        {/* Mobile: the favorite toggle sits at the bottom-right corner of the art. */}
        <FavoriteButton name={name} active={isFavorite} onClick={toggleFavorite} className="absolute right-3 bottom-3 z-10 lg:hidden" />
        {/* Desktop: a favorited NFT keeps a heart at the bottom-right corner of the art (hidden while the hover actions show). */}
        {isFavorite && (
          <span
            aria-hidden
            className="absolute right-3 bottom-3 z-10 hidden size-[35px] place-items-center rounded bg-ink/70 transition-opacity group-focus-within:opacity-0 group-hover:opacity-0 lg:grid"
            data-testid="favorite-indicator"
          >
            <Heart className="size-4 fill-primary text-primary" />
          </span>
        )}
        {/* Desktop (Figma hover): cart, favorite, view — also revealed on keyboard focus. */}
        <div className="absolute inset-x-0 bottom-3 z-10 hidden justify-center gap-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 lg:flex">
          {onQuickAdd && !nft.soldOut && (
            <button type="button" className={actionClass} onClick={() => onQuickAdd(nft)} aria-label={t.catalog.quickAddToCart(name)}>
              <ShoppingCart aria-hidden className="size-4" />
            </button>
          )}
          <FavoriteButton name={name} active={isFavorite} onClick={toggleFavorite} />
          <Link to="/nft/$nftId" params={{ nftId: nft.id }} className={actionClass} aria-label={t.catalog.view(name)} tabIndex={-1}>
            <Search aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
      <h3 id={`nft-${nft.id}`} className="text-base leading-4">
        {/* Whole-card link target is the title (single tab stop per card). */}
        <Link
          to="/nft/$nftId"
          params={{ nftId: nft.id }}
          className="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
        >
          {name}
        </Link>
      </h3>
      <p className="flex items-baseline gap-3 text-lg leading-4 font-bold text-text-accent">
        {formatEth(nft.priceEth)}
        {nft.compareAtPriceEth && (
          <span className="font-normal text-brand-secondary">
            <span className="sr-only">{t.catalog.compareAt(formatEth(nft.compareAtPriceEth))}</span>
            <span aria-hidden>{formatEth(nft.compareAtPriceEth)}</span>
          </span>
        )}
      </p>
    </article>
  )
}

function FavoriteButton({ name, active, onClick, className }: { name: string; active: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      className={cn(actionClass, className)}
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `${t.favorites.remove}: ${name}` : `${t.favorites.add}: ${name}`}
    >
      <Heart aria-hidden className={cn('size-4', active && 'fill-primary text-primary')} />
    </button>
  )
}

export function NftCardSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-3">
      <div className="bg-card pt-6 pb-1">
        <Skeleton className="mx-auto aspect-square w-[calc(100%-8px)] rounded-[15px]" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}
