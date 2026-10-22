import { createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { ComingSoon } from '@/components/layout/ComingSoon'
import { signOut } from '@/features/auth/session-actions'
import { t } from '@/i18n'
import { iconSrc, type IconName } from '@/lib/assets'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_auth/account')({ component: AccountLayout })

// Figma Account Sidebar (70420:4536): 45 px rows, 16 px side padding, 12 px icon gap, regular weight.
// The active row is marked by the 6 px primary border (+16 px gap), not by weight or color.
const itemClass = 'flex h-[45px] shrink-0 items-center gap-3 px-4 text-[15px] whitespace-nowrap text-text-accent'

function AccountLayout() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto flex max-w-page flex-col gap-7 px-4 py-6 lg:flex-row lg:px-0 lg:py-8">
      <nav aria-label={t.account.title} className="shrink-0 bg-card pt-2 pb-3 lg:w-[310px] lg:self-start">
        <h2 className="p-2.5 text-lg leading-4 font-bold">{t.account.title}</h2>
        <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0">
          <AccountLink to="/account/profile" icon="icon-user-primary" size={18} label={t.account.nav.profile} />
          <AccountLink to="/account/wallets" icon="icon-location-secondary" size={20} label={t.account.nav.wallets} />
          <ComingSoonItem icon="icon-shopping-secondary" size={18} label={t.account.nav.activity} />
          <li>
            <Link to="/favorites" className={itemClass}>
              <Icon name="icon-heart-secondary" size={16} />
              {t.account.nav.wishlist}
            </Link>
          </li>
          <ComingSoonItem icon="icon-activity" size={18} label={t.account.nav.offers} />
          <ComingSoonItem icon="icon-download" size={18} label={t.account.nav.downloads} />
          <ComingSoonItem icon="icon-danger-triangle" size={18} label={t.account.nav.support} />
          <li className="lg:border-t lg:border-border">
            <button
              type="button"
              onClick={() => void signOut(() => navigate({ to: '/' }))}
              className={cn(itemClass, 'w-full gap-2 font-bold lg:h-10')}
            >
              <Icon name="icon-logout-accent" size={20} />
              {t.account.nav.signOut}
            </button>
          </li>
        </ul>
      </nav>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

/**
 * Figma icon box (16–20 px) with the glyph at its exported size, centered: the SVGs are cropped to the
 * glyph (e.g. location 13.7×16.3), so stretching them to the box made them larger and heavier.
 */
function Icon({ name, size }: { name: IconName; size: number }) {
  return (
    <span aria-hidden className="grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <img src={iconSrc(name)} alt="" className="max-h-full max-w-full" />
    </span>
  )
}

function AccountLink({
  to,
  icon,
  size,
  label,
}: {
  to: '/account/profile' | '/account/wallets'
  icon: IconName
  size: number
  label: string
}) {
  return (
    <li>
      <Link to={to} className={itemClass} activeProps={{ className: 'border-l-[6px] border-primary gap-4', 'aria-current': 'page' }}>
        <Icon name={icon} size={size} />
        {label}
      </Link>
    </li>
  )
}

function ComingSoonItem({ icon, size, label }: { icon: IconName; size: number; label: string }) {
  return (
    <li>
      <ComingSoon className={cn(itemClass, 'w-full')}>
        <Icon name={icon} size={size} />
        {label}
      </ComingSoon>
    </li>
  )
}
