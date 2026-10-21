import { Link, useLocation } from '@tanstack/react-router'
import { ScanLine } from 'lucide-react'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import { comingSoonProps } from './coming-soon'

const items = [
  { to: '/', label: t.tabBar.home, icon: 'icon-home-tabbar.svg' },
  { to: '/favorites', label: t.tabBar.favorites, icon: 'icon-heart-tabbar.svg' },
  { to: '/cart', label: t.tabBar.cart, icon: 'icon-shop-tabbar.svg' },
  { to: '/account/profile', label: t.tabBar.profile, icon: 'icon-user-tabbar.svg' },
] as const

export function MobileTabBar() {
  const { pathname } = useLocation()
  const [first, second, ...rest] = items
  return (
    <nav
      aria-label={t.tabBar.label}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {[first, second].map((item) => (
          <TabItem key={item.to} {...item} active={pathname === item.to} />
        ))}
        <li>
          <button
            type="button"
            {...comingSoonProps}
            aria-label={`${t.tabBar.scan} (${t.comingSoon})`}
            className="-mt-8 grid size-14 place-items-center rounded-full bg-gradient-to-b from-primary/40 to-primary text-primary-foreground shadow-lg"
          >
            <ScanLine aria-hidden className="size-6" />
          </button>
        </li>
        {rest.map((item) => (
          <TabItem key={item.to} {...item} active={pathname.startsWith(item.to)} />
        ))}
      </ul>
    </nav>
  )
}

function TabItem({ to, label, icon, active }: { to: string; label: string; icon: string; active: boolean }) {
  return (
    <li>
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        className={cn('flex flex-col items-center gap-1 text-[11px]', active ? 'font-bold text-text-accent' : 'text-muted-foreground')}
      >
        <img src={`/assets/icons/${icon}`} alt="" width={24} height={24} />
        {label}
      </Link>
    </li>
  )
}
