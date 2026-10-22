import { Link } from '@tanstack/react-router'
import { NftArt } from '@/components/nft/NftArt'
import { Skeleton } from '@/components/ui/skeleton'
import type { NftSummary } from '@/contracts/nft'
import { t } from '@/i18n'
import { nftDisplayName } from '../format'

export function FeaturedBanner({ nft }: { nft: NftSummary | undefined }) {
  return (
    <aside
      aria-labelledby="featured-title"
      className="hidden w-[310px] flex-col gap-4 bg-gradient-to-b from-primary/10 to-primary/[0.03] pt-6 lg:flex"
    >
      <h2 id="featured-title" className="px-5 text-2xl leading-8 font-bold text-text-accent">
        {t.catalog.featuredTitle}
      </h2>
      <p className="px-5 text-center text-[22px] leading-4 font-bold">{t.catalog.featuredSubtitle}</p>
      {nft ? (
        <Link to="/nft/$nftId" params={{ nftId: nft.id }} className="mt-2 block">
          <NftArt art={nft.art} alt={nftDisplayName(nft)} width={310} className="w-full rounded-[22px]" />
        </Link>
      ) : (
        <Skeleton className="aspect-square w-full rounded-[22px]" />
      )}
    </aside>
  )
}
