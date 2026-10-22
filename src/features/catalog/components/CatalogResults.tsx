import type { UseQueryResult } from '@tanstack/react-query'
import { NftCard, NftCardSkeleton } from '@/components/nft/NftCard'
import { Button } from '@/components/ui/button'
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

const gridClass = 'grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-[34px] lg:gap-y-[72px]'

/** Loading (skeleton, same footprint), error + retry, empty, success, background update (I4). */
export function CatalogResults({ list, isFavorite, onToggleFavorite, onQuickAdd, onClearFilters }: CatalogResultsProps) {
  if (list.isPending) {
    return (
      <div aria-busy="true" className={gridClass} data-testid="catalog-skeleton">
        <span className="sr-only">{t.catalog.updating}</span>
        {Array.from({ length: CATALOG_PAGE_SIZE }, (_, index) => (
          // Static placeholders never reorder: index key is safe here.
          // oxlint-disable-next-line react/no-array-index-key
          <NftCardSkeleton key={index} />
        ))}
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
  const updating = list.isFetching

  return (
    <div className="flex flex-col gap-10">
      <output className="sr-only">{updating ? t.catalog.updating : t.catalog.results(total)}</output>
      {updating && (
        <p aria-hidden className="text-sm text-muted-foreground" data-testid="catalog-updating">
          {t.catalog.updating}
        </p>
      )}
      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded bg-card p-6">
          <p>{t.catalog.empty}</p>
          <Button variant="outline" onClick={onClearFilters}>
            {t.catalog.clearFilters}
          </Button>
        </div>
      ) : (
        <ul className={cn(gridClass, updating && 'opacity-70 transition-opacity')} aria-label={t.catalog.results(total)}>
          {items.map((nft, index) => (
            <li key={nft.id} className={cn(index % 2 === 1 && 'mt-8 lg:mt-0')}>
              <NftCard nft={nft} isFavorite={isFavorite(nft.id)} onToggleFavorite={onToggleFavorite} onQuickAdd={onQuickAdd} />
            </li>
          ))}
        </ul>
      )}
      <CatalogPagination page={page} totalPages={totalPages} />
    </div>
  )
}
