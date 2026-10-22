import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { NftCard, NftCardSkeleton } from '@/components/nft/NftCard'
import { Button } from '@/components/ui/button'
import { t } from '@/i18n'
import { favoritesQuery, useFavorites } from '../queries'

export function FavoritesGrid({ userId }: { userId: string }) {
  const favorites = useQuery(favoritesQuery(userId))
  const actions = useFavorites()

  if (favorites.isPending) {
    return (
      <ul aria-busy="true" className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
        {['a', 'b', 'c', 'd'].map((key) => (
          <li key={key}>
            <NftCardSkeleton />
          </li>
        ))}
      </ul>
    )
  }
  if (favorites.isError) {
    return (
      <div role="alert" className="flex items-center gap-4">
        {t.catalog.error}
        <Button variant="outline" onClick={() => void favorites.refetch()}>
          {t.catalog.retry}
        </Button>
      </div>
    )
  }
  if (favorites.data.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded bg-card p-6">
        <p>{t.favorites.empty}</p>
        <Link to="/" hash="catalogo" className="text-text-accent underline">
          {t.favorites.explore}
        </Link>
      </div>
    )
  }
  return (
    <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
      {favorites.data.map((nft) => (
        <li key={nft.id}>
          <NftCard nft={nft} isFavorite={actions.isFavorite(nft.id)} onToggleFavorite={actions.toggle} />
        </li>
      ))}
    </ul>
  )
}
