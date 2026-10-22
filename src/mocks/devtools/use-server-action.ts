import { useCallback, useEffect, useState } from 'react'
import { t } from '@/i18n'
import { mockControl } from '../control'
import type { DbState } from '../server/db'

/**
 * Server state for the panel (read-only snapshot) plus a runner for control-API calls: each action
 * is announced and followed by a fresh snapshot. The panel never touches the app's cache or state.
 */
export function useServerAction() {
  const [snapshot, setSnapshot] = useState<DbState | null>(null)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => setSnapshot(await mockControl.snapshot()), [])

  // Initial read of the simulated server (an external system to this panel).
  useEffect(() => {
    let live = true
    void mockControl.snapshot().then((state) => live && setSnapshot(state))
    return () => {
      live = false
    }
  }, [])

  const run = useCallback(
    async (label: string, action: () => unknown) => {
      setBusy(true)
      try {
        await action()
        setStatus(t.mockPanel.done(label))
      } catch (error) {
        // Visible in the panel and in the console: a failed admin action must never pass silently.
        console.error('[mock panel]', label, error)
        setStatus(t.mockPanel.failed(label))
      } finally {
        setBusy(false)
        await refresh()
      }
    },
    [refresh],
  )

  return { snapshot, status, busy, run }
}
