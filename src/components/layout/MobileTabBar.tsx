import { Link, useLocation } from '@tanstack/react-router'
import { ScanLine } from 'lucide-react'
import { t } from '@/i18n'
import { iconSrc, type IconName } from '@/lib/assets'
import { cn } from '@/lib/utils'
import { CartEntry } from './CartEntry'
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
  if (label === 'cart') {
    return (
      <li>
        <CartEntry label={t.tabBar.cart} side="top" className="relative grid size-11 place-items-center">
          <img src={iconSrc(icon)} alt="" width={24} height={24} />
        </CartEntry>
      </li>
    )
  }
  return (
    <li>
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        // Figma: icons only — the name is sr-only; the active tab gets a dot besides the color (WCAG 1.4.1).
        className={cn(
          'relative grid size-11 place-items-center',
          active && 'after:absolute after:bottom-0.5 after:size-1 after:rounded-full after:bg-primary',
        )}
      >
        <img src={iconSrc(icon)} alt="" width={24} height={24} />
        <span className="sr-only">{t.tabBar[label]}</span>
      </Link>
    </li>
  )
}
