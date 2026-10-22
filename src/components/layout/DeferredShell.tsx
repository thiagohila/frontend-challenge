import { lazy, Suspense, useEffect, useState } from 'react'
import { useSession } from '@/lib/session/store'

// Not needed for the first paint: loaded on demand to keep them off the critical path (L2).
const ReauthDialog = lazy(() => import('@/features/auth/components/ReauthDialog').then((module) => ({ default: module.ReauthDialog })))
const Toaster = lazy(() => import('@/components/ui/sonner').then((module) => ({ default: module.Toaster })))

/** Re-auth dialog only when a session expires; the toaster right after the first paint. */
export function DeferredShell() {
  const state = useSession()
  const [painted, setPainted] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setPainted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <Suspense fallback={null}>
      {state.status === 'expired' && <ReauthDialog />}
      {/* Bottom, above the mobile tab/buy bars: top toasts covered the mobile top-bar actions. */}
      {painted && <Toaster position="bottom-center" mobileOffset={{ bottom: 184 }} />}
    </Suspense>
  )
}
