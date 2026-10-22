import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { NftArt } from '@/components/nft/NftArt'
import { t } from '@/i18n'

/** Promo CTAs lead to real catalog views (tab filters), not to out-of-scope pages. */
export function HomePromos() {
  return (
    <section aria-label={t.catalog.sectionTitle} className="mx-auto mt-24 hidden max-w-page grid-cols-2 gap-7 lg:grid">
      {t.catalog.promos.map((promo) => (
        <article key={promo.title[0]} className="flex h-[250px] overflow-hidden rounded-lg bg-card">
          {/* Square art, uncropped (Figma), as tall as the 250 px card. Sized on the <img>: <picture> is inline. */}
          <NftArt art={promo.art} alt="" width={250} className="size-[250px] max-w-none shrink-0" />
          <div className="flex flex-col items-end justify-center gap-3 py-5 pr-[30px] pl-2 text-right">
            <h2 className="text-base leading-5 font-bold">
              {promo.title[0]}
              <br />
              {promo.title[1]}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">{promo.text}</p>
            <Link
              to="/"
              search={{ tab: promo.tab }}
              hash="catalogo"
              className="mt-3 inline-flex h-10 w-[140px] items-center justify-center gap-1 rounded bg-primary text-sm font-bold text-primary-foreground hover:bg-text-accent"
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
