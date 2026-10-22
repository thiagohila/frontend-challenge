import { useQuery } from '@tanstack/react-query'
import { NftCard, NftCardSkeleton } from '@/components/nft/NftCard'
import { relatedQuery } from '@/features/catalog/queries'
import { useFavorites } from '@/features/favorites/queries'
import { t } from '@/i18n'

export function RelatedNfts({ nftId, title = t.detail.related }: { nftId: string; title?: string }) {
  const related = useQuery(relatedQuery(nftId))
  const favorites = useFavorites()
  return (
    <section aria-labelledby="related-title" className="mt-16 lg:mt-24">
      <h2 id="related-title" className="border-b border-border pb-3 text-[17px] font-bold text-text-accent">
        {title}
      </h2>
      <ul className="mt-7 grid auto-cols-[175px] grid-flow-col gap-4 overflow-x-auto pb-2 lg:grid-flow-row lg:grid-cols-5 lg:gap-[26px] lg:overflow-visible">
        {related.isPending
          ? ['a', 'b', 'c', 'd', 'e'].map((key) => (
              <li key={key}>
                <NftCardSkeleton />
              </li>
            ))
          : related.data?.map((nft) => (
              <li key={nft.id}>
                <NftCard nft={nft} isFavorite={favorites.isFavorite(nft.id)} onToggleFavorite={favorites.toggle} />
              </li>
            ))}
      </ul>
    </section>
  )
}
