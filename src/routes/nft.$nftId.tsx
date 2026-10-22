import { createFileRoute, Link, notFound, useNavigate, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { nftDetailQuery } from '@/features/catalog/queries'
import { nftDisplayName } from '@/features/catalog/format'
import { NftDetailSkeleton, NftDetailView } from '@/features/nft/components/NftDetailView'
import { t } from '@/i18n'
import { isApiError } from '@/lib/api-error'

export const Route = createFileRoute('/nft/$nftId')({
  validateSearch: z.object({ edition: z.string().max(40).optional().catch(undefined) }),
  // Direct access works: the loader fetches (or reuses) the detail; unknown id → 404 page (C5).
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(nftDetailQuery(params.nftId))
    } catch (error) {
      if (isApiError(error) && error.status === 404) throw notFound()
      throw error
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${nftDisplayName(loaderData)} — Kurio` : `${t.detail.notFoundTitle} — Kurio` }],
  }),
  pendingComponent: NftDetailSkeleton,
  notFoundComponent: NftNotFound,
  errorComponent: NftLoadError,
  component: NftDetailRoute,
})

function NftDetailRoute() {
  const { nftId } = Route.useParams()
  const { edition } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  return (
    <NftDetailView
      nftId={nftId}
      editionId={edition}
      onEditionChange={(id) => void navigate({ search: { edition: id }, replace: true, resetScroll: false })}
    />
  )
}

function NftNotFound() {
  return (
    <div className="mx-auto grid min-h-[50vh] max-w-page place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">{t.detail.notFoundTitle}</h1>
        <p className="mt-2 text-muted-foreground">{t.detail.notFoundBody}</p>
        <Link to="/" hash="catalogo" className="mt-6 inline-block text-text-accent underline">
          {t.detail.backToCatalog}
        </Link>
      </div>
    </div>
  )
}

function NftLoadError() {
  const router = useRouter()
  return (
    <div role="alert" className="mx-auto grid min-h-[50vh] max-w-page place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">{t.detail.loadError}</h1>
        <Button className="mt-6" onClick={() => void router.invalidate()}>
          {t.detail.retry}
        </Button>
      </div>
    </div>
  )
}
