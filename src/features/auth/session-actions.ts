import { toast } from 'sonner'
import type { SessionResponse } from '@/contracts/auth'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { guestCart } from '@/lib/guest'
import { queryClient } from '@/lib/query-client'
import { endSessionResources } from '@/lib/session/lifecycle'
import { session } from '@/lib/session/store'
import { removeStorageByPrefix, writeStorage } from '@/lib/storage'
import { authApi } from './api'
import type { Intent } from './redirect'

const privateKeyPrefix = (userId: string) => `kurio:${userId}:`

/** Wipes everything private of the previous session: resources, cache and namespaced storage (A5, X4). */
async function clearPrivateState(userId: string | null) {
  await endSessionResources()
  await queryClient.cancelQueries()
  queryClient.clear()
  if (userId) {
    removeStorageByPrefix('session', privateKeyPrefix(userId))
    removeStorageByPrefix('local', privateKeyPrefix(userId))
  }
}

export async function completeSignIn(response: SessionResponse, intent?: Intent) {
  const previousUserId = session.userId()
  // Different user (or re-auth as someone else): nothing from the previous account may survive.
  if (previousUserId && previousUserId !== response.user.id) await clearPrivateState(previousUserId)
  // Persist the intent BEFORE signing in: intent runners react to the session change synchronously.
  if (intent) writeStorage('session', `${privateKeyPrefix(response.user.id)}intent`, intent)
  session.signIn(response)
  if (previousUserId === response.user.id) await queryClient.invalidateQueries()

  const guestId = guestCart.peek()
  if (guestId) {
    try {
      const { cart, adjustments } = await authApi.mergeGuestCart(guestId)
      guestCart.forget()
      if (cart.items.length) toast.success(adjustments.length ? t.auth.cartAdjusted(adjustments.length) : t.auth.cartMerged)
    } catch {
      // keep the guest id: the merge is retried on the next sign-in
    }
  }
  announce(t.auth.signedIn(response.user.displayName))
}

/**
 * Safe sign-out order (ARCHITECTURE §7): mark anonymous first so in-flight private queries
 * don't trigger re-auth, let the caller navigate away, then tear down and clear.
 */
export async function signOut(navigateAway: () => Promise<void> | void) {
  const state = session.get()
  const token = state.status === 'authenticated' ? state.token : null
  const userId = session.userId()
  session.signOut()
  await navigateAway()
  await clearPrivateState(userId)
  if (token) await authApi.logout(token).catch(() => undefined)
  announce(t.auth.signedOut)
}
