import { Link, useLocation } from '@tanstack/react-router'
import { useRef } from 'react'
import { useBottomBarHeight } from '@/hooks/use-bottom-bar-height'
import { t } from '@/i18n'
import { iconSrc, type IconName } from '@/lib/assets'
import { cn } from '@/lib/utils'
import { CartEntry } from './CartEntry'
import { ComingSoon } from './ComingSoon'

// `label` is a dictionary key, resolved at render time (the locale can change).
// `center` is the Figma icon center as a share of the 414 px frame (Tab Bar 70395:245).
const items = [
  { to: '/', label: 'home', icon: 'icon-home-tabbar', width: 16, height: 17, center: 'left-[11.1%]' },
  { to: '/favorites', label: 'favorites', icon: 'icon-heart-tabbar', width: 20, height: 18, center: 'left-[28.5%]' },
  { to: '/cart', label: 'cart', icon: 'icon-shop-tabbar', width: 20, height: 20, center: 'left-[72.9%]' },
  { to: '/account/profile', label: 'profile', icon: 'icon-user-tabbar', width: 20, height: 20, center: 'left-[87.9%]' },
] as const satisfies readonly {
  to: string
  label: keyof typeof t.tabBar
  icon: IconName
  width: number
  height: number
  center: string
}[]

type TabItemProps = (typeof items)[number] & { active: boolean }

// Figma "Scan" glyph: five exported strokes, placed as in the 27×24 group (px from its top-left).
const scanParts = [
  { icon: 'icon-scan-part-1', top: 11.1, left: 0, width: 26.8, height: 1.8 },
  { icon: 'icon-scan-part-5', top: 0, left: 1.3, width: 10.4, height: 10.3 },
  { icon: 'icon-scan-part-3', top: 0, left: 15.1, width: 10.4, height: 10.3 },
  { icon: 'icon-scan-part-2', top: 13.7, left: 1.3, width: 10.3, height: 10.3 },
  { icon: 'icon-scan-part-4', top: 13.7, left: 15.1, width: 10.3, height: 10.3 },
] as const satisfies readonly { icon: IconName; top: number; left: number; width: number; height: number }[]

/**
 * Figma tab bar: a 95 px card with a notch cradling the 65 px scan FAB, which rises 31 px above it.
 * The notch is a fixed-width SVG between two stretching sides, so the curve never distorts.
 */
export function MobileTabBar() {
  const { pathname } = useLocation()
  const bar = useRef<HTMLElement>(null)
  useBottomBarHeight(bar)
  return (
    <nav
      ref={bar}
      aria-label={t.tabBar.label}
      // The 31 px above the card is see-through: only the FAB and the card take clicks.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[calc(126px+env(safe-area-inset-bottom))] lg:hidden"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 flex h-[calc(95px+env(safe-area-inset-bottom))] drop-shadow-[0_-10px_15px_rgba(10,6,4,.45)]"
      >
        <div className="pointer-events-auto flex-1 rounded-tl-[29px] bg-card" />
        <div className="pointer-events-auto -mx-px flex w-[153.7px] shrink-0 flex-col">
          <svg width="153.7" height="95" viewBox="-1 0 153.7 95" className="block shrink-0 fill-card">
            <path d="M152.7 0H151.7C137.94 0 125.72 8.2 119.87 20.65C112.11 37.17 95.31 48.62 75.85 48.62C56.39 48.62 39.59 37.18 31.83 20.65C25.98 8.2 13.75 0 0 0H-1V95H152.7Z" />
          </svg>
          <div className="-mt-px flex-1 bg-card" />
        </div>
        <div className="pointer-events-auto flex-1 rounded-tr-[29px] bg-card" />
      </div>

      <ul className="absolute inset-x-0 top-[31px] h-[95px]">
        {items.map((item) => (
          <TabItem key={item.to} {...item} active={item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)} />
        ))}
        <li className="absolute -top-[31px] left-1/2 -translate-x-1/2">
          <ComingSoon
            aria-label={`${t.tabBar.scan} (${t.comingSoon})`}
            className="pointer-events-auto grid size-[65px] place-items-center rounded-full bg-[linear-gradient(180deg,rgba(210,138,76,.4)_-17%,#d28a4c_109%)] transition-transform active:scale-95 motion-reduce:transition-none"
          >
            <span aria-hidden className="relative block h-6 w-[27px]">
              {scanParts.map((part) => (
                <img
                  key={part.icon}
                  src={iconSrc(part.icon)}
                  alt=""
                  className="absolute max-w-none"
                  style={{ top: part.top, left: part.left, width: part.width, height: part.height }}
                />
              ))}
            </span>
          </ComingSoon>
        </li>
      </ul>
    </nav>
  )
}

function TabItem({ to, label, icon, width, height, center, active }: TabItemProps) {
  // Figma: icon centers 50 px below the card top; 44 px hit area around them.
  const position = cn('pointer-events-auto absolute top-7 grid size-11 -translate-x-1/2 place-items-center', center)
  const glyph = <img src={iconSrc(icon)} alt="" width={width} height={height} />
  if (label === 'cart') {
    return (
      <li>
        <CartEntry label={t.tabBar.cart} side="top" className={position}>
          {glyph}
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
        className={cn(position, active && 'after:absolute after:bottom-0.5 after:size-1 after:rounded-full after:bg-primary')}
      >
        {glyph}
        <span className="sr-only">{t.tabBar[label]}</span>
      </Link>
    </li>
  )
}
