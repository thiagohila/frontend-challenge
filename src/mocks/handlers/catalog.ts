import { HttpResponse } from 'msw'
import { nftListQuerySchema } from '@/contracts/nft'
import { serverContext as ctx } from '../server/browser-context'
import { validation } from '../server/errors'
import { featured, listNfts, nftDetail, related } from '../server/services/catalog'
import { listFavorites, setFavorite } from '../server/services/favorites'
import { route } from './route'

function parseListQuery(url: URL) {
  const params = url.searchParams
  const number = (key: string) => (params.has(key) ? Number(params.get(key)) : undefined)
  const list = (key: string) => (params.getAll(key).length ? params.getAll(key) : undefined)
  const parsed = nftListQuerySchema.safeParse({
    q: params.get('q') ?? undefined,
    collection: list('collection'),
    network: list('network'),
    priceMin: params.get('priceMin') ?? undefined,
    priceMax: params.get('priceMax') ?? undefined,
    tab: params.get('tab') ?? undefined,
    sort: params.get('sort') ?? undefined,
    page: number('page'),
    pageSize: number('pageSize'),
  })
  if (!parsed.success) throw validation({ query: 'Parâmetros de busca inválidos' })
  return parsed.data
}

export const catalogHandlers = [
  route('get', '/nfts', ({ request }) => listNfts(ctx, parseListQuery(new URL(request.url)))),
  route('get', '/nfts/featured', () => featured(ctx)),
  route('get', '/nfts/:id', ({ params }) => nftDetail(ctx, String(params.id))),
  route('get', '/nfts/:id/related', ({ params }) => related(ctx, String(params.id))),

  route('get', '/me/favorites', async ({ user }) => listFavorites(ctx, (await user()).id), { private: true }),
  route('put', '/me/favorites/:nftId', async ({ user, params }) => setFavorite(ctx, (await user()).id, String(params.nftId), true), {
    private: true,
  }),
  route(
    'delete',
    '/me/favorites/:nftId',
    async ({ user, params }) => {
      await setFavorite(ctx, (await user()).id, String(params.nftId), false)
      return new HttpResponse(null, { status: 204 })
    },
    { private: true },
  ),
]
