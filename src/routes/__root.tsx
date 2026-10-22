import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Link, Outlet, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LiveRegion } from '@/components/layout/LiveRegion'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { Toaster } from '@/components/ui/sonner'
import { ReauthDialog } from '@/features/auth/components/ReauthDialog'
import { TooltipProvider } from '@/components/ui/tooltip'
import { t } from '@/i18n'
import type { session } from '@/lib/session/store'

export interface RouterContext {
  queryClient: QueryClient
  session: typeof session
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
})

// Mobile screens with their own bottom bar (buy bar / checkout CTA) hide the tab bar (Figma).
const HIDE_TAB_BAR = ['/nft/', '/cart', '/checkout']

function RootLayout() {
  const { pathname } = useLocation()
  const showTabBar = !HIDE_TAB_BAR.some((path) => pathname.startsWith(path))
  useRouteFocus()

  return (
    <TooltipProvider>
      <HeadContent />
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t.skipToContent}
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      {showTabBar && <MobileTabBar />}
      <ReauthDialog />
      <LiveRegion />
      <Toaster position="top-center" />
    </TooltipProvider>
  )
}

// After client-side navigation, move focus to the page heading (a11y checklist: route change).
function useRouteFocus() {
  const router = useRouter()
  const first = useRef(true)
  useEffect(
    () =>
      router.subscribe('onResolved', ({ pathChanged }) => {
        if (first.current) {
          first.current = false
          return
        }
        if (!pathChanged) return
        const heading = document.querySelector<HTMLElement>('main h1')
        if (heading) {
          heading.tabIndex = -1
          heading.focus({ preventScroll: true })
        }
      }),
    [router],
  )
}

function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center gap-4 p-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold">{t.notFound.title}</h1>
        <Link to="/" className="mt-4 inline-block text-text-accent underline">
          {t.notFound.back}
        </Link>
      </div>
    </div>
  )
}
