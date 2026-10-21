import { useEffect, useState } from 'react'
import { subscribeAnnouncements } from '@/lib/announce'

export function LiveRegion() {
  const [message, setMessage] = useState('')

  useEffect(
    () =>
      subscribeAnnouncements((next) => {
        // Clear first so repeating the same message is announced again.
        setMessage('')
        requestAnimationFrame(() => setMessage(next))
      }),
    [],
  )

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only" data-testid="live-region">
      {message}
    </div>
  )
}
