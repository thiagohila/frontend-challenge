import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'
import { ChevronLeft, Heart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { nftDetailQuery } from '@/features/catalog/queries'
import { nftDisplayName } from '@/features/catalog/format'
import { useFavorites } from '@/features/favorites/queries'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import { NftGallery } from './NftGallery'
import { NftInfoTabs } from './NftInfoTabs'
import { PurchasePanel } from './PurchasePanel'
import { RelatedNfts } from './RelatedNfts'

interface NftDetailViewProps {
  nftId: string
  editionId: string | undefined
  onEditionChange: (editionId: string) => void
}

export function NftDetailView({ nftId, editionId, onEditionChange }: NftDetailViewProps) {
  const { data: nft } = useSuspenseQuery(nftDetailQuery(nftId))
  const router = useRouter()
  const favorites = useFavorites()
  const isFavorite = favorites.isFavorite(nft.id)
  const name = nftDisplayName(nft)

  return (
    <div className="mx-auto max-w-page px-4 pt-4 pb-72 lg:px-0 lg:pt-8 lg:pb-0">
      {/* Mobile top bar (Figma): back + favorite. */}
      <div className="mb-4 flex justify-between lg:hidden">
        <button type="button" onClick={() => router.history.back()} aria-label={t.detail.back} className="grid size-[30px] place-items-center rounded-full border border-border bg-surface-raised">
          <ChevronLeft aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => favorites.toggle(nft)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `${t.favorites.remove}: ${name}` : `${t.favorites.add}: ${name}`}
          className="grid size-[30px] place-items-center rounded-full border border-border bg-surface-raised text-text-accent"
        >
          <Heart aria-hidden className={cn('size-4', isFavorite && 'fill-primary')} />
        </button>
      </div>

      <nav aria-label={t.detail.breadcrumb} className="mb-4 hidden text-[15px] font-bold lg:block">
        <ol className="flex gap-1">
          <li>
            <Link to="/">{t.detail.home}</Link> /
          </li>
          <li>
            <Link to="/" hash="catalogo">
              {t.detail.market}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
        <NftGallery art={nft.art} name={name} />
        <div className="rounded-t-[31px] bg-card px-6 pt-6 lg:w-[530px] lg:rounded-none lg:bg-transparent lg:p-0">
          <PurchasePanel nft={nft} editionId={editionId} onEditionChange={onEditionChange} />
        </div>
      </div>

      <NftInfoTabs nft={nft} />
      <RelatedNfts nftId={nft.id} />
    </div>
  )
}

export function NftDetailSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto flex max-w-page flex-col gap-8 px-4 pt-8 lg:flex-row lg:px-0" data-testid="detail-skeleton">
      <Skeleton className="aspect-square w-full rounded-3xl lg:size-[573px]" />
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
