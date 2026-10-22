import { useLocation, useRouter } from '@tanstack/react-router'
import { type MouseEvent, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { t } from '@/i18n'
import { focusCatalogSearch, isMarketPath, MARKET_ANCHOR, type NavSection } from '@/lib/anchors'
import { cn } from '@/lib/utils'
import { ComingSoon } from './ComingSoon'

/**
 * Which top-level section the user is in: market-flow screens are "Mercado"; on "/" it follows the
 * scroll (the catalog section reaching the upper part of the viewport makes "Mercado" current).
 */
function useActiveSection(): NavSection {
  const { pathname } = useLocation()
  const [onCatalog, setOnCatalog] = useState(false)
  const onHome = pathname === '/'

  useEffect(() => {
    if (!onHome) return
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const section = document.getElementById(MARKET_ANCHOR)
        setOnCatalog(Boolean(section && section.getBoundingClientRect().top <= window.innerHeight * 0.4))
      })
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [onHome])

  if (isMarketPath(pathname)) return 'market'
  return onHome && onCatalog ? 'market' : 'home'
}

// Figma: 21 px label + 24 px gap; the sliding underline sits at the bottom of the 45 px row (on the divider).
const navItemClass = (current: boolean) =>
  cn('block pb-6 leading-[21px] transition-colors', current ? 'font-bold text-text-accent' : 'text-foreground hover:text-text-accent')

/** Desktop main navigation (Figma Header Row) with one underline that slides to the current section. */
export function MainNav() {
  const active = useActiveSection()
  const list = useRef<HTMLUListElement>(null)
  const links = useRef<Partial<Record<NavSection, HTMLAnchorElement | null>>>({})
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const place = () => {
      const link = links.current[active]
      if (link) setMarker({ left: link.offsetLeft, width: link.offsetWidth })
    }
    place()
    // Bold (active) labels and font loading change widths: follow them.
    const observer = new ResizeObserver(place)
    if (list.current) observer.observe(list.current)
    return () => observer.disconnect()
  }, [active])

  return (
    <nav aria-label={t.nav.label}>
      <ul ref={list} className="relative flex gap-10 text-base">
        <li>
          <SectionLink
            section="home"
            current={active === 'home'}
            register={(node) => (links.current.home = node)}
            className={navItemClass(active === 'home')}
          >
            {t.nav.home}
          </SectionLink>
        </li>
        <li>
          <SectionLink
            section="market"
            current={active === 'market'}
            register={(node) => (links.current.market = node)}
            className={navItemClass(active === 'market')}
          >
            {t.nav.market}
          </SectionLink>
        </li>
        <li>
          <ComingSoon className="text-foreground">{t.nav.creators}</ComingSoon>
        </li>
        <li>
          <ComingSoon className="text-foreground">{t.nav.learn}</ComingSoon>
        </li>
        {marker && (
          <li
            aria-hidden
            className="pointer-events-none absolute bottom-0 h-[3px] bg-primary transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
            style={{ left: marker.left, width: marker.width }}
          />
        )}
      </ul>
    </nav>
  )
}

/**
 * A link to a home section whose "current" state is decided by the caller (the visible section), not
 * by the URL: the router's <Link> forces `aria-current` from the URL, so `/#mercado` scrolled back to
 * the top would mark "Mercado". Typed target through `buildLocation`; navigation through the router.
 */
export function SectionLink({
  section,
  current = false,
  focusSearch = false,
  register,
  className,
  children,
  ...rest
}: {
  section: NavSection
  current?: boolean
  /** Header search: after reaching the catalog, focus its search field. */
  focusSearch?: boolean
  register?: (node: HTMLAnchorElement | null) => void
  className?: string
  children: ReactNode
  'aria-label'?: string
}) {
  const router = useRouter()
  const target = section === 'market' ? ({ to: '/', hash: MARKET_ANCHOR } as const) : ({ to: '/' } as const)
  const href = router.buildLocation(target).href

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    // "Início" on the home page scrolls back to the top (the router doesn't scroll for a hash-only change).
    if (section === 'home' && router.state.location.pathname === '/') {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    }
    void router.navigate(target).then(() => {
      if (focusSearch) focusCatalogSearch()
    })
  }

  return (
    <a ref={register} href={href} onClick={onClick} aria-current={current ? 'page' : undefined} className={className} {...rest}>
      {children}
    </a>
  )
}
