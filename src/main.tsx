import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { env } from '@/env'
import { markMocksReady } from '@/lib/mocks-ready'
import { queryClient } from '@/lib/query-client'
import { session } from '@/lib/session/store'
import { routeTree } from './routeTree.gen'
import './index.css'

const router = createRouter({
  routeTree,
  context: { queryClient, session, currentPage: () => router.state.resolvedLocation },
  defaultPreload: 'intent',
  scrollRestoration: true,
  // In-page anchors (#mercado) glide into view, unless the user prefers reduced motion.
  defaultHashScrollIntoView: { behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' },
})

// Guards depend on the session: re-evaluate them whenever it changes.
session.subscribe(() => void router.invalidate())

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

async function enableMocks() {
  if (!env.enableMocks) return
  const { startMockServer } = await import('./mocks/browser')
  await startMockServer()
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('#root element missing from index.html')

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)

enableMocks()
  .catch((error: unknown) => console.error('Failed to start API mocks', error))
  .finally(() => {
    markMocksReady()
    // Lazy: keeps sign-in code (toasts, cart merge) out of the entry chunk.
    void import('@/features/auth/session-actions').then(({ verifyStoredSession }) => verifyStoredSession())
  })
