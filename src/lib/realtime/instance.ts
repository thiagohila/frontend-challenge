import { useSyncExternalStore } from 'react'
import { queryClient } from '@/lib/query-client'
import { onSessionEnd } from '@/lib/session/lifecycle'
import { createRealtimeManager } from './manager'

type Applied = Parameters<Parameters<typeof createRealtimeManager>[1]>[0]
const appliedListeners = new Set<(result: Applied) => void>()

export const realtime = createRealtimeManager(queryClient, (result) => {
  for (const listener of appliedListeners) listener(result)
})

// Sign-out / user switch tears the ended user's connection down before private caches are cleared (A5).
// A socket already reopened by `RealtimeBridge` for the next session is left alone.
onSessionEnd((userId) => realtime.stopIfUser(userId))

export function onRealtimeApplied(listener: (result: Applied) => void) {
  appliedListeners.add(listener)
  return () => {
    appliedListeners.delete(listener)
  }
}

export const useRealtimeStatus = () => useSyncExternalStore(realtime.subscribe, realtime.getStatus, realtime.getStatus)
