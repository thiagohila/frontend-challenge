import { ComingSoon } from '@/components/layout/ComingSoon'
import { NftArt } from '@/components/nft/NftArt'
import { t } from '@/i18n'

/** "Diário da Cunhagem" — editorial content, out of scope (S14): static, "Ler mais" is "Em breve". */
export function MintJournal() {
  return (
    <section aria-labelledby="journal-title" className="mx-auto mt-24 hidden max-w-page lg:block">
      <h2 id="journal-title" className="text-center text-[28px] font-bold">
        {t.catalog.blogTitle}
      </h2>
      <p className="mt-3 text-center text-sm text-muted-foreground">{t.catalog.blogSubtitle}</p>
      <ul className="mt-10 grid grid-cols-[repeat(4,268px)] gap-6">
        {t.catalog.posts.map((post) => (
          <li key={post.title}>
            <article className="flex h-full flex-col overflow-hidden rounded-lg bg-card">
              <NftArt art={post.art} alt="" width={268} className="h-[195px] w-full object-cover" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xs text-muted-foreground">
                  {post.date} | {post.read}
                </p>
                <h3 className="text-sm font-bold">{post.title}</h3>
                <p className="text-xs text-muted-foreground">{post.excerpt}</p>
                {/* Footer of the card: pinned to the bottom whatever the excerpt length. */}
                <ComingSoon className="mt-auto self-start pt-2 text-xs font-bold text-text-accent">{t.catalog.readMore}</ComingSoon>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
