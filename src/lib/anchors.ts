/** In-page anchor of the catalog section on "/" (`/#mercado`), the target of every "Mercado"/explore link. */
export const MARKET_ANCHOR = 'mercado'

/** Top-level sections of the main navigation (Figma Header Row: Início, Mercado). */
export type NavSection = 'home' | 'market'

/** Market-flow screens: "Mercado" is the current section there (and the header has no divider). */
const MARKET_PATHS = ['/nft', '/cart', '/checkout', '/orders']
export const isMarketPath = (pathname: string) => MARKET_PATHS.some((path) => pathname.startsWith(path))

/** Marks the catalog search inputs (one per breakpoint) so the header search can focus the visible one. */
export const CATALOG_SEARCH_ATTRIBUTE = 'data-catalog-search'

/**
 * Focuses the visible catalog search once it is rendered (the header search may come from another
 * page, so the catalog mounts after navigation). `preventScroll`: the anchor scroll is already running.
 */
export function focusCatalogSearch(timeoutMs = 3000) {
  const started = performance.now()
  const attempt = () => {
    const input = [...document.querySelectorAll<HTMLInputElement>(`[${CATALOG_SEARCH_ATTRIBUTE}]`)].find(
      (candidate) => candidate.offsetParent !== null,
    )
    if (input) input.focus({ preventScroll: true })
    else if (performance.now() - started < timeoutMs) requestAnimationFrame(attempt)
  }
  requestAnimationFrame(attempt)
}
