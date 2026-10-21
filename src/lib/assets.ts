import type { ArtName, IconName } from './assets.gen'
import { ART_WIDTHS } from './assets.gen'

export type { ArtName, IconName }

export const iconSrc = (name: IconName) => `/assets/icons/${name}.svg`

/** Responsive sources for NFT art (AVIF preferred, WebP fallback). */
export function artSources(name: ArtName) {
  const srcSet = (format: 'avif' | 'webp') =>
    ART_WIDTHS.map((width) => `/assets/nft/${name}-${width}.${format} ${width}w`).join(', ')
  return { avif: srcSet('avif'), webp: srcSet('webp'), fallback: `/assets/nft/${name}-512.webp` }
}
