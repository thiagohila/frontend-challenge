import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CatalogHome } from '@/features/catalog/components/CatalogHome'
import { catalogSearchSchema, withFilters } from '@/features/catalog/search'

export const Route = createFileRoute('/')({
  validateSearch: catalogSearchSchema,
  head: () => ({ meta: [{ title: 'Kurio — Marketplace de NFTs' }] }),
  component: HomeRoute,
})

function HomeRoute() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/' })
  return (
    <CatalogHome
      search={search}
      onSearchChange={(patch, options) =>
        void navigate({ search: withFilters(patch), replace: options?.replace ?? false, resetScroll: false })
      }
      onClearFilters={() => void navigate({ search: {}, resetScroll: false })}
    />
  )
}
