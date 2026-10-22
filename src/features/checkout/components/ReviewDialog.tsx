import type { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { Network } from '@/contracts/common'
import type { Quote } from '@/contracts/quote'
import { FormError } from '@/components/form/FormError'
import { t } from '@/i18n'
import { OrderLines } from './OrderLines'

interface ReviewDialogProps {
  open: boolean
  quote: Quote
  walletLabel: string
  network: Network
  /** Values changed since the dialog opened: the next click only acknowledges them. */
  changed: boolean
  submitting: boolean
  error: string | null
  onSubmit: () => void
  onClose: () => void
  /** Receives focus on close: the dialog is opened programmatically (no Radix trigger to restore to). */
  returnFocusTo: RefObject<HTMLButtonElement | null>
}

/** Review before sending (P1). The submit button is disabled while in flight: no double orders (P5). */
export function ReviewDialog({
  open,
  quote,
  walletLabel,
  network,
  changed,
  submitting,
  error,
  onSubmit,
  onClose,
  returnFocusTo,
}: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && !submitting && onClose()}>
      <DialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocusTo.current?.focus()
        }}
        // Only the item list scrolls (OrderLines scrollLines): title, totals and the actions stay in view.
        className="flex max-h-[90dvh] w-[min(560px,calc(100vw-2rem))] max-w-none flex-col overflow-hidden rounded-lg border border-border bg-card p-6 sm:max-w-none"
      >
        <DialogTitle className="text-xl font-bold">{t.checkout.review.title}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">{t.checkout.review.description}</DialogDescription>
        <dl className="grid grid-cols-2 gap-3 rounded bg-surface-raised p-3 text-sm">
          <div>
            <dt className="text-muted-foreground">{t.checkout.review.wallet}</dt>
            <dd className="font-bold">{walletLabel}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t.checkout.review.network}</dt>
            <dd className="font-bold">{t.networks[network]}</dd>
          </div>
        </dl>
        {changed && (
          <p role="alert" className="rounded border border-primary/60 bg-primary/10 p-3 text-sm" data-testid="review-changed">
            {t.checkout.staleQuote}
          </p>
        )}
        <OrderLines quote={quote} scrollLines />
        <FormError message={error} />
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row-reverse">
          <Button onClick={onSubmit} disabled={submitting} className="h-[52px] text-base font-bold sm:flex-1">
            {submitting ? t.checkout.review.submitting : changed ? t.checkout.review.acknowledge : t.checkout.review.submit}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={submitting} className="h-[52px] text-base sm:flex-1">
            {t.checkout.review.back}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
