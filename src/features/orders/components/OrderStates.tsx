import { Link } from '@tanstack/react-router'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Order } from '@/contracts/order'
import { t } from '@/i18n'

/** The confirmation has no site chrome (Figma modal): the X is the way back to the catalog. */
export function CloseLink() {
  return (
    <Link
      to="/"
      aria-label={t.auth.close}
      className="absolute top-4 right-4 grid size-8 place-items-center text-text-accent hover:text-foreground"
    >
      <X aria-hidden className="size-4" />
    </Link>
  )
}

export function PendingOrder() {
  return (
    <section
      aria-labelledby="order-title"
      className="relative mx-auto flex max-w-[578px] flex-col items-center gap-4 rounded-lg bg-card p-10 text-center"
      data-testid="order-pending"
    >
      <CloseLink />
      <Loader2 aria-hidden className="size-10 animate-spin text-primary motion-reduce:animate-none" />
      <h1 id="order-title" className="text-xl font-bold">
        {t.order.pendingTitle}
      </h1>
      <p className="text-sm text-muted-foreground">{t.order.pendingBody}</p>
    </section>
  )
}

export function DeclinedOrder({ order }: { order: Order }) {
  return (
    <section
      role="alert"
      aria-labelledby="order-title"
      className="relative mx-auto flex max-w-[578px] flex-col items-center gap-4 rounded-lg border border-destructive/60 bg-card p-10 text-center"
      data-testid="order-declined"
    >
      <CloseLink />
      <h1 id="order-title" className="text-xl font-bold text-destructive">
        ✕ {t.order.declinedTitle}
      </h1>
      {order.declineReason && <p className="text-sm">{order.declineReason}</p>}
      <p className="text-sm text-muted-foreground">{t.order.declinedBody}</p>
      <Button asChild>
        <Link to="/checkout">{t.order.backToCheckout}</Link>
      </Button>
    </section>
  )
}
