import { Link, useLocation } from '@tanstack/react-router'
import { ScanLine } from 'lucide-react'
import { t } from '@/i18n'
import { iconSrc, type IconName } from '@/lib/assets'
import { cn } from '@/lib/utils'
import { ComingSoon } from './ComingSoon'

// `label` is a dictionary key, resolved at render time (the locale can change).
const items = [
  { to: '/', label: 'home', icon: 'icon-home-tabbar' },
  { to: '/favorites', label: 'favorites', icon: 'icon-heart-tabbar' },
  { to: '/cart', label: 'cart', icon: 'icon-shop-tabbar' },
  { to: '/account/profile', label: 'profile', icon: 'icon-user-tabbar' },
] as const satisfies readonly { to: string; label: keyof typeof t.tabBar; icon: IconName }[]

export function MobileTabBar() {
  const { pathname } = useLocation()
  const left = items.slice(0, 2)
  const right = items.slice(2)
  return (
    <nav
      aria-label={t.tabBar.label}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {left.map((item) => (
          <TabItem key={item.to} {...item} active={pathname === item.to} />
        ))}
        <li>
          <ComingSoon
            aria-label={`${t.tabBar.scan} (${t.comingSoon})`}
            className="-mt-8 grid size-14 place-items-center rounded-full bg-gradient-to-b from-primary/40 to-primary text-primary-foreground shadow-lg"
          >
            <ScanLine aria-hidden className="size-6" />
          </ComingSoon>
        </li>
        {right.map((item) => (
          <TabItem key={item.to} {...item} active={pathname.startsWith(item.to)} />
        ))}
      </ul>
    </nav>
  )
}

function TabItem({ to, label, icon, active }: { to: string; label: (typeof items)[number]['label']; icon: IconName; active: boolean }) {
  return (
    <li>
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        className={cn('flex flex-col items-center gap-1 text-[11px]', active ? 'font-bold text-text-accent' : 'text-muted-foreground')}
      >
        <img src={iconSrc(icon)} alt="" width={24} height={24} />
        {t.tabBar[label]}
      </Link>
    </li>
  )
}
