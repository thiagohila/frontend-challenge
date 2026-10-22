import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { nftDetailQuery } from '@/features/catalog/queries'
import { nftDisplayName } from '@/features/catalog/format'
import { useFavorites } from '@/features/favorites/queries'
import { t } from '@/i18n'
import { iconSrc } from '@/lib/assets'
import { cn } from '@/lib/utils'
import { NftGallery } from './NftGallery'
import { NftInfoTabs } from './NftInfoTabs'
import { PurchasePanel } from './PurchasePanel'
import { RelatedNfts } from './RelatedNfts'
import { Breadcrumb } from '@/components/layout/Breadcrumb'

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

  // Mobile: the Figma hero gradient (506 px) sits behind the top bar and the art; the page below is ink.
  return (
    <div className="mx-auto max-w-page bg-[linear-gradient(137.6deg,#241612_12%,#2f1d15_106.6%)] bg-[length:100%_506px] bg-no-repeat px-[26px] pt-6 lg:bg-none lg:px-0 lg:pt-8">
      {/* Mobile top bar (Figma): back + favorite. */}
      <div className="mb-2 flex justify-between lg:hidden">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label={t.detail.back}
          className="grid size-[35px] place-items-center rounded-full border border-border bg-surface-raised"
        >
          {/* The Figma glyph is a chevron drawn pointing down and rotated 90° into a back arrow. */}
          <img src={iconSrc('icon-arrow-left-secondary')} alt="" width={13} height={7} className="rotate-90" />
        </button>
        <button
          type="button"
          onClick={() => favorites.toggle(nft)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `${t.favorites.remove}: ${name}` : `${t.favorites.add}: ${name}`}
          className="grid size-[35px] place-items-center rounded-full border border-border bg-surface-raised text-text-accent"
        >
          <Heart aria-hidden className={cn('size-4', isFavorite && 'fill-primary')} />
        </button>
      </div>

      <Breadcrumb className="mb-4" />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <NftGallery art={nft.art} name={name} />
        <div className="relative z-10 -mx-[26px] -mt-[62px] rounded-[31px] bg-card px-6 pt-8 pb-6 lg:mx-0 lg:mt-0 lg:w-[595px] lg:rounded-none lg:bg-transparent lg:p-0">
          <PurchasePanel nft={nft} editionId={editionId} onEditionChange={onEditionChange} />
        </div>
      </div>

      <NftInfoTabs nft={nft} />
      <RelatedNfts nftId={nft.id} />
    </div>
  )
}
