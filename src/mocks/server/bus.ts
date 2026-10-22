import type { RealtimeEvent } from '@/contracts/events'

/**
 * Domain events raised by the simulated backend whenever data changes. The Socket.IO mock
 * subscribes and forwards them — so every change is visible both via REST and via events (M9).
 */
type Listener = (event: RealtimeEvent) => void
const listeners = new Set<Listener>()

export const bus = {
  publish(event: RealtimeEvent) {
    for (const listener of listeners) listener(event)
  },
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export const newEventId = () => `evt_${crypto.randomUUID()}`
