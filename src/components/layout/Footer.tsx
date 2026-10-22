import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { t } from '@/i18n'
import { iconSrc, type IconName } from '@/lib/assets'
import { ComingSoon } from './ComingSoon'

const SOCIAL: readonly { name: string; icon: IconName }[] = [
  { name: 'Facebook', icon: 'social-facebook' },
  { name: 'Instagram', icon: 'social-instagram' },
  { name: 'Twitter', icon: 'social-twitter' },
  { name: 'LinkedIn', icon: 'social-linkedin' },
  { name: 'YouTube', icon: 'social-youtube' },
]

export function Footer() {
  const { footer } = t
  return (
    <footer className="mx-auto mt-24 w-full max-w-page px-4 pb-24 lg:px-0 lg:pb-6">
      <div className="grid gap-8 bg-card p-6 lg:grid-cols-[1fr_1fr_1fr_1.2fr] lg:gap-0 lg:px-10 lg:py-8">
        {footer.features.map((feature) => (
          <section key={feature.letter} className="lg:border-r lg:border-primary lg:px-6 lg:first:pl-0">
            <span
              aria-hidden
              className="grid size-[66px] place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
            >
              {feature.letter}
            </span>
            <h2 className="mt-4 text-base font-bold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.body}</p>
          </section>
        ))}
        <div className="lg:pl-6">
          <h2 className="text-base leading-4 font-bold">{footer.newsletterTitle}</h2>
          <div className="mt-4 flex shadow-[0_0_10px_rgba(10,6,4,.45)]">
            <label htmlFor="newsletter-email" className="sr-only">
              {footer.newsletterLabel}
            </label>
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder={footer.newsletterPlaceholder}
              className="h-10 min-w-0 flex-1 bg-surface-dark px-3 text-sm placeholder:text-brand-secondary"
            />
            <ComingSoon className="h-10 bg-primary px-3 text-base font-bold text-primary-foreground">{footer.newsletterSubmit}</ComingSoon>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">{footer.newsletterNote}</p>
        </div>
      </div>

      <div className="grid gap-3 bg-surface-dark px-6 py-6 text-sm sm:grid-cols-2 lg:grid-cols-4 lg:px-7">
        <span className="font-bold tracking-[0.1em]">{t.brand}</span>
        <span>{footer.tagline}</span>
        <a href={`mailto:${footer.email}`}>{footer.email}</a>
        <a href={`tel:${footer.phone.replace(/\s/g, '')}`}>{footer.phone}</a>
      </div>

      <div className="grid grid-cols-2 gap-8 bg-card px-6 py-8 text-sm lg:grid-cols-4 lg:px-7">
        <FooterColumn title={footer.columns.profile.title}>
          <li>
            <Link to="/account/profile">{footer.columns.profile.items[0]}</Link>
          </li>
          {footer.columns.profile.items.slice(1).map((item) => (
            <ComingSoonItem key={item} label={item} />
          ))}
        </FooterColumn>
        <FooterColumn title={footer.columns.help.title}>
          {footer.columns.help.items.map((item) => (
            <ComingSoonItem key={item} label={item} />
          ))}
        </FooterColumn>
        <FooterColumn title={footer.columns.collections.title}>
          {footer.columns.collections.items.map(({ label, slug }) => (
            <li key={slug}>
              <Link to="/" search={{ collection: [slug] }} hash="catalogo">
                {label}
              </Link>
            </li>
          ))}
        </FooterColumn>
        <div className="col-span-2 lg:col-span-1">
          <h2 className="text-lg font-bold">{footer.social}</h2>
          <ul className="mt-4 flex gap-2">
            {SOCIAL.map(({ name, icon }) => (
              <li key={name}>
                <ComingSoon
                  aria-label={`${name} (${t.comingSoon})`}
                  className="grid size-7 place-items-center rounded border border-primary"
                >
                  <img src={iconSrc(icon)} alt="" width={16} height={16} />
                </ComingSoon>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 text-lg font-bold">{footer.wallets}</h2>
          <p className="mt-3 inline-block rounded border border-border-soft bg-surface-dark px-2 py-1 text-[11px] font-bold tracking-[0.01em] text-text-accent">
            {footer.walletsList}
          </p>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        {footer.copyright} · <span data-testid="app-version">{footer.version(__APP_COMMIT__)}</span>
      </p>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold">{title}</h2>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  )
}

function ComingSoonItem({ label }: { label: string }) {
  return (
    <li>
      <ComingSoon className="text-left">{label}</ComingSoon>
    </li>
  )
}
