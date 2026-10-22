import type { ArtName } from '@/lib/assets'
import { artSources } from '@/lib/assets'
import { cn } from '@/lib/utils'

interface NftArtProps {
  art: ArtName
  alt: string
  /** Rendered CSS width hint for `sizes` (px). */
  width: number
  className?: string
  /** LCP image: eager + high priority (L2). Everything else is lazy. */
  priority?: boolean
  /** Override `sizes` (must match an HTML preload to reuse the request). */
  sizes?: string
}

/** Responsive NFT artwork: AVIF → WebP, intrinsic size reserved to avoid CLS (U3, U7). */
export function NftArt({ art, alt, width, className, priority = false, sizes: sizesOverride }: NftArtProps) {
  const sources = artSources(art)
  const sizes = sizesOverride ?? `(max-width: 640px) 45vw, ${width}px`
  return (
    <picture>
      <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
      <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
      <img
        src={sources.fallback}
        alt={alt}
        width={width}
        height={width}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('aspect-square object-cover', className)}
      />
    </picture>
  )
}
