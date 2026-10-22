import { useQuery } from '@tanstack/react-query'
import { useQuickAddToCart } from '@/features/cart/queries'
import { useFavorites } from '@/features/favorites/queries'
import { t } from '@/i18n'
import { featuredQuery, nftListQuery } from '../queries'
import { type CatalogSearch, toListQuery } from '../search'
import { CatalogFilters } from './CatalogFilters'
import { CatalogResults } from './CatalogResults'
import { CatalogSearchField } from './CatalogSearchField'
import { CatalogToolbar } from './CatalogToolbar'
import { FeaturedBanner } from './FeaturedBanner'
import { HomeHero } from './HomeHero'
import { HomePromos } from './HomePromos'
import { MintJournal } from './MintJournal'
import { MobileFilters } from './MobileFilters'
import { MARKET_ANCHOR } from '@/lib/anchors'

interface CatalogHomeProps {
  search: CatalogSearch
  /** `replace` for keystrokes (search typing), push for explicit filter changes (history restore). */
  onSearchChange: (patch: Partial<Omit<CatalogSearch, 'page'>>, options?: { replace?: boolean }) => void
  onClearFilters: () => void
}

export function CatalogHome({ search, onSearchChange, onClearFilters }: CatalogHomeProps) {
  const list = useQuery(nftListQuery(toListQuery(search)))
  const featured = useQuery(featuredQuery())
  const favorites = useFavorites()
  const quickAdd = useQuickAddToCart()

  const filterProps = {
    search,
    facets: list.data?.facets,
    onChange: (patch: Partial<Omit<CatalogSearch, 'page'>>) => onSearchChange(patch),
  }

  return (
    <>
      <div className="mx-auto mt-6 flex max-w-page gap-3 px-4 lg:hidden">
        <CatalogSearchField value={search.q} onSearch={(q) => onSearchChange({ q }, { replace: true })} className="flex-1" />
        <MobileFilters {...filterProps} />
      </div>

      <HomeHero />

      <section
        id={MARKET_ANCHOR}
        aria-labelledby="catalog-title"
        className="mx-auto mt-10 flex max-w-page scroll-mt-6 gap-12 px-4 lg:mt-24 lg:scroll-mt-[94px] lg:px-0"
      >
        <h2 id="catalog-title" className="sr-only">
          {t.catalog.sectionTitle}
        </h2>
        <div className="hidden w-[310px] shrink-0 flex-col gap-6 lg:flex">
          <CatalogSearchField value={search.q} onSearch={(q) => onSearchChange({ q }, { replace: true })} />
          <CatalogFilters {...filterProps} />
          <FeaturedBanner nft={featured.data?.spotlight} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <CatalogToolbar
            tab={search.tab ?? 'all'}
            sort={search.sort ?? 'recent'}
            onTab={(tab) => onSearchChange({ tab: tab === 'all' ? undefined : tab })}
            onSort={(sort) => onSearchChange({ sort: sort === 'recent' ? undefined : sort })}
          />
          <CatalogResults
            list={list}
            isFavorite={favorites.isFavorite}
            onToggleFavorite={favorites.toggle}
            onQuickAdd={(nft) => void quickAdd(nft)}
            onClearFilters={onClearFilters}
          />
        </div>
      </section>

      <HomePromos />
      <MintJournal />
    </>
  )
}
