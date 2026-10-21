// Polite screen-reader announcements for mutations and realtime changes (rendered by <LiveRegion />).
type Listener = (message: string) => void
const listeners = new Set<Listener>()

export function announce(message: string) {
  for (const listener of listeners) listener(message)
}

export function subscribeAnnouncements(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
