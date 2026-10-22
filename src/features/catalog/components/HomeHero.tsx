import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { NftArt } from '@/components/nft/NftArt'
import { Skeleton } from '@/components/ui/skeleton'
import type { NftSummary } from '@/contracts/nft'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import { nftDisplayName } from '../format'

/** Hero with a manual carousel (dots). No auto-rotation: respects motion/a11y preferences. */
export function HomeHero({ slides }: { slides: NftSummary[] | undefined }) {
  const [index, setIndex] = useState(0)
  const current = slides?.[index] ?? slides?.[0]

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto mt-6 max-w-page px-4 lg:mt-8 lg:flex lg:items-center lg:justify-between lg:px-0"
    >
      <div className="relative z-10 overflow-hidden rounded-xl bg-[linear-gradient(139.5deg,#241612_12%,#2f1d15_106.6%)] p-4 lg:w-[600px] lg:rounded-none lg:bg-none lg:p-0 lg:pl-12">
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
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-text-accent lg:mt-12 lg:h-10 lg:rounded-md lg:bg-primary lg:px-7 lg:text-sm lg:text-primary-foreground"
        >
          {t.catalog.explore}
          <ArrowRight aria-hidden className="size-4 lg:hidden" />
        </Link>
        {/* Mobile: art sits inside the hero card (Figma). */}
        <div className="absolute top-3 right-3 w-[138px] lg:hidden">
          {current ? (
            <NftArt art={current.art} alt={nftDisplayName(current)} width={138} priority className="rounded-xl" />
          ) : (
            <Skeleton className="aspect-square rounded-xl" />
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        {current ? (
          <Link to="/nft/$nftId" params={{ nftId: current.id }} className="block">
            <NftArt art={current.art} alt={nftDisplayName(current)} width={450} priority className="size-[450px] rounded-3xl" />
          </Link>
        ) : (
          <Skeleton className="size-[450px] rounded-3xl" />
        )}
      </div>

      {slides && slides.length > 1 && (
        <fieldset className="mt-3 flex justify-center gap-2 lg:absolute lg:bottom-6 lg:left-[620px] lg:mt-0">
          <legend className="sr-only">{t.catalog.featuredTitle}</legend>
          {slides.map((slide, position) => (
            <button
              key={slide.id}
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
