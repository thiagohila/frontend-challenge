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
  await endSessionResources(userId)
  if (userId) {
    // Only the ended user's queries: public ones (catalog) may already be mounted and fetching on the
    // destination route — a global clear() would orphan them (found in audit: catalog stuck after sign-out).
    const privateKey = ['user', userId]
    await queryClient.cancelQueries({ queryKey: privateKey })
    queryClient.removeQueries({ queryKey: privateKey })
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

  // Merge the guest cart BEFORE publishing the session: signing in re-runs route guards, which may
  // navigate away immediately and abort an in-flight merge (found by e2e under load — REVIEW-LOG B5).
  const merge = await mergeGuestCart(response.token)

  session.signIn(response)
  if (previousUserId === response.user.id) await queryClient.invalidateQueries()
  if (merge?.hadItems) toast.success(merge.adjusted ? t.auth.cartAdjusted(merge.adjusted) : t.auth.cartMerged)
  announce(t.auth.signedIn(response.user.displayName))
}

async function mergeGuestCart(token: string) {
  const guestId = guestCart.peek()
  if (!guestId) return null
  try {
    const { cart, adjustments } = await authApi.mergeGuestCart(guestId, token)
    guestCart.forget()
    return { hadItems: cart.items.length > 0, adjusted: adjustments.length }
  } catch {
    return null // keep the guest id: the merge is retried on the next sign-in
  }
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
