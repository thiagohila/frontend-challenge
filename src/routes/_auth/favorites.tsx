import { createFileRoute } from '@tanstack/react-router'
import { FavoritesGrid } from '@/features/favorites/components/FavoritesGrid'
import { t } from '@/i18n'
import { useSessionUser } from '@/lib/session/store'

export const Route = createFileRoute('/_auth/favorites')({
  head: () => ({ meta: [{ title: 'Favoritos — Kurio' }] }),
  component: FavoritesRoute,
})

function FavoritesRoute() {
  const user = useSessionUser()
  return (
    <div className="mx-auto max-w-page px-4 py-8 lg:px-0">
      <h1 className="mb-8 text-2xl font-bold">{t.favorites.title}</h1>
      {user && <FavoritesGrid userId={user.id} />}
    </div>
  )
}
