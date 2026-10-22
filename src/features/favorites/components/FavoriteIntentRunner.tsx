import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { intentSchema } from '@/features/auth/redirect'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { queryKeys } from '@/lib/query-keys'
import { useSession } from '@/lib/session/store'
import { readStorage, removeStorage } from '@/lib/storage'
import { favoritesApi } from '../api'

/** Resumes "favoritar" chosen as a visitor, right after sign-in (S9: return to the previous flow). */
export function FavoriteIntentRunner() {
  const state = useSession()
  const queryClient = useQueryClient()
  const userId = state.status === 'authenticated' ? state.user.id : null

  useEffect(() => {
    if (!userId) return
    const key = `kurio:${userId}:intent`
    const parsed = intentSchema.safeParse(readStorage('session', key))
    if (!parsed.success || !parsed.data.startsWith('favorite:')) return
    removeStorage('session', key)
    const nftId = parsed.data.slice('favorite:'.length)
    favoritesApi
      .add(nftId)
      .then(() => queryClient.invalidateQueries({ queryKey: queryKeys.favorites(userId) }))
      .catch(() => announce(t.favorites.failed))
  }, [userId, queryClient])

  return null
}
