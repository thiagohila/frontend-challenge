import { createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { ComingSoon } from '@/components/layout/ComingSoon'
import { signOut } from '@/features/auth/session-actions'
import { t } from '@/i18n'
import { iconSrc, type IconName } from '@/lib/assets'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_auth/account')({ component: AccountLayout })

const itemClass = 'flex h-[45px] items-center gap-3 border-l-[6px] border-transparent px-3 text-[15px] text-text-accent'

function AccountLayout() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto flex max-w-page flex-col gap-7 px-4 py-6 lg:flex-row lg:px-0 lg:py-8">
      <nav aria-label={t.account.title} className="shrink-0 bg-card py-5 lg:w-[310px] lg:self-start">
        <h2 className="px-3 pb-2 text-lg font-bold">{t.account.title}</h2>
        <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0">
          <AccountLink to="/account/profile" icon="icon-user-primary" label={t.account.nav.profile} />
          <AccountLink to="/account/wallets" icon="icon-location-accent" label={t.account.nav.wallets} />
          <ComingSoonItem icon="icon-shopping-secondary" label={t.account.nav.activity} />
          <li>
            <Link to="/favorites" className={itemClass}>
              <img src={iconSrc('icon-heart-accent')} alt="" width={18} height={18} />
              {t.account.nav.wishlist}
            </Link>
          </li>
          <ComingSoonItem icon="icon-activity" label={t.account.nav.offers} />
          <ComingSoonItem icon="icon-download" label={t.account.nav.downloads} />
          <ComingSoonItem icon="icon-danger-triangle" label={t.account.nav.support} />
          <li className="lg:mt-1 lg:border-t lg:border-border">
            <button type="button" onClick={() => void signOut(() => navigate({ to: '/' }))} className={cn(itemClass, 'w-full font-bold')}>
              <img src={iconSrc('icon-logout-accent')} alt="" width={18} height={18} />
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

function AccountLink({ to, icon, label }: { to: '/account/profile' | '/account/wallets'; icon: IconName; label: string }) {
  return (
    <li>
      <Link to={to} className={itemClass} activeProps={{ className: 'border-primary! font-bold', 'aria-current': 'page' }}>
        <img src={iconSrc(icon)} alt="" width={18} height={18} />
        {label}
      </Link>
    </li>
  )
}

function ComingSoonItem({ icon, label }: { icon: IconName; label: string }) {
  return (
    <li>
      <ComingSoon className={cn(itemClass, 'w-full')}>
        <img src={iconSrc(icon)} alt="" width={18} height={18} />
        {label}
      </ComingSoon>
    </li>
  )
}
