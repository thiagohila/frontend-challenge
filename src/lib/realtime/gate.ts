import type { RealtimeEvent } from '@/contracts/events'

/**
 * Decides whether an incoming event may touch client state (RT3, RT5):
 * 1) private events of another user/session are dropped; 2) duplicates (same eventId) are dropped;
 * 3) events older than or equal to the last applied version of that resource are dropped.
 * Pure and deterministic — unit tested in tests/unit/realtime-gate.spec.ts.
 */
export function createEventGate(maxSeen = 500) {
  const seen = new Set<string>()
  const versions = new Map<string, number>()

  return {
    accept(event: RealtimeEvent, currentUserId: string | null): boolean {
      if (event.userId && event.userId !== currentUserId) return false
      if (seen.has(event.eventId)) return false
      const key = `${event.type}:${event.resourceId}`
      if (event.version <= (versions.get(key) ?? 0) && event.type !== 'wallet.disconnected') return false

      seen.add(event.eventId)
      if (seen.size > maxSeen) seen.delete(seen.values().next().value as string)
      versions.set(key, event.version)
      return true
    },
    reset() {
      seen.clear()
      versions.clear()
    },
  }
}

export type EventGate = ReturnType<typeof createEventGate>
