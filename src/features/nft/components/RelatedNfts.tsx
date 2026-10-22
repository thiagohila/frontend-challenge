import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { NftCard, NftCardSkeleton } from '@/components/nft/NftCard'
import { useQuickAddToCart } from '@/features/cart/queries'
import { relatedQuery } from '@/features/catalog/queries'
import { useFavorites } from '@/features/favorites/queries'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 5

/**
 * "Mais desta coleção" (Figma carousel with dots): desktop shows pages of 5 with a fade between them;
 * mobile scrolls horizontally through all of them. Cards carry the cart/favorite/view actions.
 */
export function RelatedNfts({ nftId, title = t.detail.related }: { nftId: string; title?: string }) {
  const related = useQuery(relatedQuery(nftId))
  const favorites = useFavorites()
  const quickAdd = useQuickAddToCart()
  const [page, setPage] = useState(0)
  const items = related.data ?? []
  const pages = Math.ceil(items.length / PAGE_SIZE)
  const current = Math.min(page, Math.max(pages - 1, 0))

  return (
    <section aria-labelledby="related-title" className="mt-16 lg:mt-24">
      <h2 id="related-title" className="border-b border-border pb-3 text-[17px] font-bold text-text-accent">
        {title}
      </h2>
      <ul
        key={current}
        className="mt-7 grid auto-cols-[175px] grid-flow-col gap-4 overflow-x-auto pb-2 lg:grid-flow-row lg:grid-cols-5 lg:gap-[26px] lg:overflow-visible lg:motion-safe:animate-in lg:motion-safe:duration-300 lg:motion-safe:fade-in"
      >
        {related.isPending
          ? ['a', 'b', 'c', 'd', 'e'].map((key) => (
              <li key={key}>
                <NftCardSkeleton />
              </li>
            ))
          : items.map((nft, index) => (
              // Desktop: only the current page; mobile: every card in the horizontal scroller.
              <li key={nft.id} className={cn(Math.floor(index / PAGE_SIZE) !== current && 'lg:hidden')}>
                <NftCard nft={nft} isFavorite={favorites.isFavorite(nft.id)} onToggleFavorite={favorites.toggle} onQuickAdd={quickAdd} />
              </li>
            ))}
      </ul>
      {pages > 1 && (
        <fieldset className="mt-6 hidden justify-center gap-2 lg:flex">
          <legend className="sr-only">{title}</legend>
          {Array.from({ length: pages }, (_, index) => `page-${index}`).map((key, index) => (
            <button
              key={key}
              type="button"
              aria-label={t.catalog.page(index + 1)}
              aria-pressed={index === current}
              onClick={() => setPage(index)}
              className="group grid size-6 place-items-center"
            >
              <span
                className={cn(
                  'block size-2.5 rounded-full border border-primary transition-colors duration-300 motion-reduce:transition-none',
                  index === current ? 'bg-primary' : 'group-hover:bg-primary/40',
                )}
              />
            </button>
          ))}
        </fieldset>
      )}
    </section>
  )
}
