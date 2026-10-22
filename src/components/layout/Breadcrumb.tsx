import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'
import { t } from '@/i18n'
import { MARKET_ANCHOR } from '@/lib/anchors'
import { cn } from '@/lib/utils'

/**
 * "Início / Mercado / …" (Figma: 15 px bold, no current-item style). Separators are their own
 * decorative items so the gap is the same on both sides of every "/".
 */
export function Breadcrumb({ current, className }: { current?: string; className?: string }) {
  const items = [
    <Link key="home" to="/">
      {t.detail.home}
    </Link>,
    <Link key="market" to="/" hash={MARKET_ANCHOR}>
      {t.detail.market}
    </Link>,
    ...(current ? [<span key="current">{current}</span>] : []),
  ]
  return (
    <nav aria-label={t.detail.breadcrumb} className={cn('hidden text-[15px] font-bold lg:block', className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <Fragment key={item.key}>
            {index > 0 && (
              <li aria-hidden className="text-muted-foreground">
                /
              </li>
            )}
            <li aria-current={current && index === items.length - 1 ? 'page' : undefined}>{item}</li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
