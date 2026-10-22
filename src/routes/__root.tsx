import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Link, Outlet, useLocation, useRouter } from '@tanstack/react-router'
import { Fragment, useEffect, useRef } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { LiveRegion } from '@/components/layout/LiveRegion'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { DeferredShell } from '@/components/layout/DeferredShell'
import { FavoriteIntentRunner } from '@/features/favorites/components/FavoriteIntentRunner'
import { PendingOrderBanner } from '@/features/orders/components/PendingOrderBanner'
import { t } from '@/i18n'
import { usePrefs } from '@/lib/prefs'
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
const HIDE_TAB_BAR = ['/nft/', '/cart', '/checkout', '/orders/']
// The order confirmation is a modal over an opaque scrim in the Figma: no site chrome around it.
const HIDE_CHROME = ['/orders/']

function RootLayout() {
  const { pathname } = useLocation()
  const showTabBar = !HIDE_TAB_BAR.some((path) => pathname.startsWith(path))
  const showChrome = !HIDE_CHROME.some((path) => pathname.startsWith(path))
  useRouteFocus()
  const locale = useLocale()

  return (
    <>
      <HeadContent />
      {/* `t` is read at render: a locale change remounts the visible shell (cached queries keep it instant). */}
      <Fragment key={locale}>
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-md bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {t.skipToContent}
        </a>
        {showChrome && <Header />}
        <PendingOrderBanner />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <Outlet />
        </main>
        {showChrome && <Footer />}
        {showTabBar && <MobileTabBar />}
        <FavoriteIntentRunner />
        <LiveRegion />
      </Fragment>
      <DeferredShell />
    </>
  )
}

// Mirrors the language on <html lang> and recomputes route heads (document titles).
function useLocale() {
  const router = useRouter()
  const { locale } = usePrefs()
  useEffect(() => {
    if (document.documentElement.lang === locale) return
    document.documentElement.lang = locale
    void router.invalidate()
  }, [locale, router])
  return locale
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
