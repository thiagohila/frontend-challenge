import { Link, useLocation } from '@tanstack/react-router'
import { t } from '@/i18n'
import { UserAvatar } from '@/components/account/UserAvatar'
import { useCart } from '@/features/cart/queries'
import { iconSrc } from '@/lib/assets'
import { useSession } from '@/lib/session/store'
import { cn } from '@/lib/utils'
import { ComingSoon } from './ComingSoon'

const MARKET_PATHS = ['/nft', '/cart', '/checkout', '/orders']

export function Header() {
  const { pathname } = useLocation()
  const sessionState = useSession()
  const cartCount = useCart().data?.itemCount ?? 0
  const inMarket = MARKET_PATHS.some((path) => pathname.startsWith(path))
  // Figma: market-flow screens use the bare Header Row; the others add the hairline divider.
  return (
    <header className={cn('mx-auto hidden w-full max-w-page pt-6 lg:block', !inMarket && 'border-b border-border')}>
      <div className="flex h-[35px] items-start justify-between">
        <Link to="/" className="w-40 pt-2 text-sm font-bold tracking-[0.1em] text-foreground">
          {t.brand}
        </Link>
        <nav aria-label={t.nav.label}>
          <ul className="flex gap-10 text-base">
            <NavItem to="/" label={t.nav.home} active={!inMarket} />
            <NavItem to="/" hash="catalogo" label={t.nav.market} active={inMarket} />
            <li>
              <ComingSoon className="text-foreground">{t.nav.creators}</ComingSoon>
            </li>
            <li>
              <ComingSoon className="text-foreground">{t.nav.learn}</ComingSoon>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-7">
          <Link to="/" hash="catalogo" aria-label={t.header.search} className="grid size-6 place-items-center">
            <img src={iconSrc('icon-search')} alt="" width={20} height={20} />
          </Link>
          <Link to="/cart" aria-label={t.header.cart(cartCount)} className="relative grid size-6 place-items-center">
            <img src={iconSrc('icon-cart')} alt="" width={24} height={24} />
            {cartCount > 0 && (
              <span
                aria-hidden
                className="absolute -top-1 -right-2 grid size-4 place-items-center rounded-full bg-primary text-[11px] font-medium leading-none text-primary-foreground"
              >
                {cartCount}
              </span>
            )}
          </Link>
          {sessionState.status === 'authenticated' ? (
            // Signed-in state is not in the Figma: derived from the account sidebar styles.
            <Link
              to="/account/profile"
              className="flex h-[35px] max-w-[180px] items-center gap-2 rounded-md border border-primary px-2 text-sm font-medium text-text-accent hover:bg-surface-raised"
            >
              <UserAvatar user={sessionState.user} className="size-6" />
              {/* Visible name first, then context for screen readers (WCAG 2.5.3 label in name). */}
              <span className="truncate">
                {sessionState.user.displayName}
                <span className="sr-only"> — {t.auth.myAccount}</span>
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              search={{ redirect: pathname }}
              className="flex h-[35px] w-[100px] items-center justify-center gap-1 rounded-md bg-primary text-base font-medium text-primary-foreground hover:bg-text-accent"
            >
              <img src={iconSrc('icon-login-ink')} alt="" width={20} height={20} />
              {t.header.signIn}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function NavItem({ to, hash, label, active }: { to: '/'; hash?: string; label: string; active: boolean }) {
  return (
    <li>
      <Link
        to={to}
        hash={hash}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'block border-b-[3px] pb-[21px]',
          active ? 'border-primary font-bold text-text-accent' : 'border-transparent text-foreground hover:text-text-accent',
        )}
      >
        {label}
      </Link>
    </li>
  )
}
