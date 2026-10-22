import type { UseQueryResult } from '@tanstack/react-query'
import { NftCard, NftCardSkeleton } from '@/components/nft/NftCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { NftListResponse, NftSummary } from '@/contracts/nft'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import { CATALOG_PAGE_SIZE } from '../search'
import { CatalogPagination } from './CatalogPagination'

interface CatalogResultsProps {
  list: UseQueryResult<NftListResponse>
  isFavorite: (id: string) => boolean
  onToggleFavorite: (nft: NftSummary) => void
  onQuickAdd: (nft: NftSummary) => void
  onClearFilters: () => void
}

// Tablet (not in the Figma): 3 columns from md; mobile masonry offset only below md.
const gridClass = 'grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:gap-x-[34px] lg:gap-y-[72px]'

/**
 * Loading and every update of the listing (filter, search, tab, sort, page, background refetch) show the
 * skeleton with the grid's footprint — no "updating" text, no stale cards; error + retry; empty (I4).
 */
export function CatalogResults({ list, isFavorite, onToggleFavorite, onQuickAdd, onClearFilters }: CatalogResultsProps) {
  if (list.isPending || (list.isFetching && !list.isError)) {
    return (
      <div aria-busy="true" className="flex flex-col gap-10" data-testid="catalog-skeleton">
        {/* Not visible (the skeleton is the visual cue), but announced. */}
        <output className="sr-only">{t.catalog.updating}</output>
        <div className={gridClass}>
          {Array.from({ length: CATALOG_PAGE_SIZE }, (_, index) => (
            // Static placeholders never reorder: index key is safe here.
            // oxlint-disable-next-line react/no-array-index-key
            <NftCardSkeleton key={index} />
          ))}
        </div>
        {/* Pagination footprint (35 px items), so the page below doesn't jump when results return. */}
        <Skeleton className="ml-auto h-[35px] w-[220px]" />
      </div>
    )
  }

  if (list.isError && !list.data) {
    return (
      <div role="alert" className="flex flex-col items-start gap-4 rounded bg-card p-6">
        <p>{t.catalog.error}</p>
        <Button onClick={() => void list.refetch()} disabled={list.isFetching}>
          {t.catalog.retry}
        </Button>
      </div>
    )
  }

  const { items, page, totalPages, total } = list.data

  return (
    <div className="flex flex-col gap-10">
      <output className="sr-only">{t.catalog.results(total)}</output>
      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded bg-card p-6">
          <p>{t.catalog.empty}</p>
          <Button variant="outline" onClick={onClearFilters}>
            {t.catalog.clearFilters}
          </Button>
        </div>
      ) : (
        <ul className={gridClass} aria-label={t.catalog.results(total)}>
          {items.map((nft, index) => (
            <li key={nft.id} className={cn(index % 2 === 1 && 'mt-8 md:mt-0')}>
              {/* First row (2 cards on mobile) is above the fold and is the mobile LCP: eager + high priority. */}
              <NftCard
                nft={nft}
                isFavorite={isFavorite(nft.id)}
                onToggleFavorite={onToggleFavorite}
                onQuickAdd={onQuickAdd}
                priority={index < 2}
              />
            </li>
          ))}
        </ul>
      )}
      <CatalogPagination page={page} totalPages={totalPages} />
    </div>
  )
}
