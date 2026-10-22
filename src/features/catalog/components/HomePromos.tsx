import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { NftArt } from '@/components/nft/NftArt'
import { t } from '@/i18n'

const PROMO_ART = ['emerald-ape', 'ivory-baron'] as const

/** Promo CTAs lead to real catalog views (tab filters), not to out-of-scope pages. */
export function HomePromos() {
  return (
    <section aria-label={t.catalog.sectionTitle} className="mx-auto mt-24 hidden max-w-page grid-cols-2 gap-7 lg:grid">
      {t.catalog.promos.map((promo, index) => (
        <article key={promo.title[0]} className="flex overflow-hidden rounded-lg bg-card">
          <NftArt art={PROMO_ART[index] ?? 'emerald-ape'} alt="" width={258} className="w-[258px] shrink-0" />
          <div className="flex flex-col items-end justify-center gap-3 p-5 text-right">
            <h2 className="text-base leading-5 font-bold">
              {promo.title[0]}
              <br />
              {promo.title[1]}
            </h2>
            <p className="text-xs leading-5 text-muted-foreground">{promo.text}</p>
            <Link
              to="/"
              search={{ tab: promo.tab }}
              hash="catalogo"
              className="inline-flex h-9 items-center gap-1 rounded bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-text-accent"
            >
              {promo.cta}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </article>
      ))}
    </section>
  )
}
