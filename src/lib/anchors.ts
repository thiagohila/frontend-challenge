/** In-page anchor of the catalog section on "/" (`/#mercado`), the target of every "Mercado"/explore link. */
export const MARKET_ANCHOR = 'mercado'

/** Top-level sections of the main navigation (Figma Header Row: Início, Mercado). */
export type NavSection = 'home' | 'market'

/** Market-flow screens: "Mercado" is the current section there (and the header has no divider). */
const MARKET_PATHS = ['/nft', '/cart', '/checkout', '/orders']
export const isMarketPath = (pathname: string) => MARKET_PATHS.some((path) => pathname.startsWith(path))
