import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCart, useCartOwner } from '@/features/cart/queries'
import { t } from '@/i18n'
import { MARKET_ANCHOR } from '@/lib/anchors'

/**
 * Cart entry point (header icon, mobile tab). With items it links to /cart; with an empty cart it
 * explains so in a popover next to the icon instead of navigating. The /cart empty state remains for
 * a cart emptied on the page itself (all items removed) or reached directly.
 */
export function CartEntry({
  label,
  className,
  side = 'bottom',
  children,
}: {
  label: string
  className: string
  side?: 'top' | 'bottom'
  children: ReactNode
}) {
  const owner = useCartOwner()
  const cart = useCart()
  // No owner yet = guest without a cart; while loading, behave as a plain link.
  const empty = owner === null || cart.data?.items.length === 0

  if (!empty) {
    return (
      <Link to="/cart" aria-label={label} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <Popover>
      <PopoverTrigger aria-label={label} className={className}>
        {children}
      </PopoverTrigger>
      <PopoverContent side={side} align="end" className="flex w-64 flex-col gap-3 text-sm" data-testid="empty-cart-popover">
        <p className="font-bold">{t.cart.empty}</p>
        <Link to="/" hash={MARKET_ANCHOR} className="font-bold text-text-accent underline-offset-4 hover:underline">
          {t.cart.explore}
        </Link>
      </PopoverContent>
    </Popover>
  )
}
