import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from '@tanstack/react-router'
import { t } from '@/i18n'
import { useSession } from '@/lib/session/store'
import { pendingOrdersQuery } from '../queries'

/** After sign-in or a reload, a pending order is surfaced so the buyer resumes it — never re-buys (RT8). */
export function PendingOrderBanner() {
  const state = useSession()
  const { pathname } = useLocation()
  const userId = state.status === 'authenticated' ? state.user.id : null
  const pending = useQuery({ ...pendingOrdersQuery(userId ?? ''), enabled: Boolean(userId) })
  const order = pending.data?.[0]
  if (!order || pathname.startsWith('/orders/')) return null
  return (
    <output
      className="mx-auto mt-4 flex max-w-page items-center justify-between gap-4 rounded border border-primary bg-primary/10 px-4 py-3 text-sm"
      data-testid="pending-order-banner"
    >
      <span>{t.order.resumeBanner}</span>
      <Link to="/orders/$orderId" params={{ orderId: order.id }} className="font-bold text-text-accent underline">
        {t.order.resumeLink}
      </Link>
    </output>
  )
}
