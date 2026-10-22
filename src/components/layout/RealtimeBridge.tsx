import { useEffect } from 'react'
import { useCartOwner } from '@/features/cart/queries'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import type { Owner } from '@/lib/query-keys'
import { onRealtimeApplied, realtime, useRealtimeStatus } from '@/lib/realtime/instance'
import { useSession } from '@/lib/session/store'

const ownerFromKey = (key: string | null): Owner | null => {
  if (!key) return null
  const [kind, id] = key.split(/:(.*)/)
  return (kind === 'user' || kind === 'guest') && id ? { kind, id } : null
}

/**
 * Binds the Socket.IO connection to the session: (re)connects with the current token and
 * announces relevant changes (U9). Shows a reconnecting banner while the socket is down.
 */
export function RealtimeBridge() {
  const state = useSession()
  const owner = useCartOwner()
  const status = useRealtimeStatus()
  const token = state.status === 'authenticated' ? state.token : null
  const userId = state.status === 'authenticated' ? state.user.id : null
  const ownerKey = owner ? `${owner.kind}:${owner.id}` : null
  const active = state.status === 'authenticated' || state.status === 'anonymous'

  // New connection per session (token): previous-session events can never reach this user.
  useEffect(() => {
    if (!active) return
    void realtime.start(token, { userId, cartOwner: ownerFromKey(ownerKey) })
    return () => realtime.stop()
  }, [active, token, userId, ownerKey])

  useEffect(
    () =>
      onRealtimeApplied((result) => {
        if (result.kind === 'nft' && result.inCart) announce(t.realtime.cartUpdated)
        if (result.kind === 'order') announce(result.status === 'confirmed' ? t.realtime.orderConfirmed : t.realtime.orderDeclined)
        if (result.kind === 'wallet') announce(t.realtime.walletDisconnected)
      }),
    [],
  )

  if (status !== 'reconnecting') return null
  return (
    <output
      className="fixed inset-x-0 top-0 z-50 block bg-surface-dark px-4 py-2 text-center text-xs text-text-accent"
      data-testid="realtime-reconnecting"
    >
      {t.realtime.reconnecting}
    </output>
  )
}
