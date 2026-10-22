import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/use-media-query'
import { NftArt } from '@/components/nft/NftArt'
import type { ArtName } from '@/lib/assets'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

/**
 * Editorial brand banner (Figma): static art, so the LCP never waits for the API/mock server
 * (L2 — data-driven highlights live in "NFT EM DESTAQUE" and the catalog tabs). The first art is
 * preloaded in index.html. Manual carousel (dots), no auto-rotation (motion/a11y preferences).
 */
const SLIDES: readonly ArtName[] = ['emerald-ape', 'sage-nomad', 'golden-beat']

export function HomeHero() {
  const [index, setIndex] = useState(0)
  // One variant per breakpoint: a display:none <img> would still be downloaded.
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const current = SLIDES[index] ?? 'emerald-ape'
  const next = SLIDES[(index + 1) % SLIDES.length] ?? 'sage-nomad'
  const slides = SLIDES

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto mt-6 max-w-page px-4 lg:mt-8 lg:flex lg:items-center lg:justify-between lg:px-0"
    >
      <div className="relative z-10 overflow-hidden rounded-xl bg-[linear-gradient(139.5deg,#241612_12%,#2f1d15_106.6%)] p-4 pb-8 lg:w-[600px] lg:rounded-none lg:bg-none lg:p-0 lg:pl-12">
        <p className="text-xs tracking-[0.1em] lg:text-sm">{t.catalog.heroEyebrow}</p>
        <h1
          id="hero-title"
          className="mt-2 max-w-[190px] text-lg leading-7 font-bold tracking-[0.05em] lg:mt-6 lg:max-w-none lg:text-[43px] lg:leading-[70px]"
        >
          <span className="lg:hidden">{t.catalog.heroTitleMobile.join(' ')}</span>
          <span className="hidden lg:inline">
            {t.catalog.heroTitle[0]}
            <br />
            {t.catalog.heroTitle[1]}
          </span>
        </h1>
        <p className="mt-2 max-w-[190px] text-xs leading-[18px] text-muted-foreground lg:mt-4 lg:max-w-[557px] lg:text-sm lg:leading-6">
          <span className="lg:hidden">{t.catalog.heroTextMobile}</span>
          <span className="hidden lg:inline">{t.catalog.heroText}</span>
        </p>
        <Link
          to="/"
          hash="catalogo"
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-text-accent lg:mt-12 lg:h-10 lg:w-[140px] lg:justify-center lg:rounded-md lg:bg-primary lg:text-base lg:text-primary-foreground"
        >
          {t.catalog.explore}
          <ArrowRight aria-hidden className="size-4 lg:hidden" />
        </Link>
        {/* Mobile: art sits inside the hero card (Figma). */}
        {!isDesktop && (
          <div className="absolute top-3 right-3 w-[138px]">
            <NftArt art={current} alt={t.catalog.heroArtAlt} width={138} sizes="138px" priority className="rounded-xl" />
            {/* Decorative overlapping thumbnail (Figma mobile). */}
            <NftArt art={next} alt="" width={70} sizes="70px" className="absolute -bottom-2.5 left-0 w-[70px] rounded-xl" />
          </div>
        )}
      </div>

      {isDesktop && (
        <NftArt art={current} alt={t.catalog.heroArtAlt} width={450} sizes="450px" priority className="size-[450px] rounded-3xl" />
      )}

      {slides.length > 1 && (
        // Mobile: dots sit inside the bottom of the hero card (Figma).
        <fieldset className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 justify-center gap-2 lg:bottom-6 lg:left-[620px] lg:translate-x-0">
          <legend className="sr-only">{t.catalog.featuredTitle}</legend>
          {slides.map((slide, position) => (
            <button
              key={slide}
              type="button"
              aria-label={t.catalog.heroSlide(position + 1, slides.length)}
              aria-pressed={position === index}
              onClick={() => setIndex(position)}
              className="grid size-6 place-items-center"
            >
              <span className={cn('block size-1.5 rounded-full bg-primary', position === index ? 'w-4' : 'opacity-60')} />
            </button>
          ))}
        </fieldset>
      )}
    </section>
  )
}
