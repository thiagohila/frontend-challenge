import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { t, translateMessage } from '@/i18n'
import { isApiError } from '@/lib/api-error'

/**
 * Failed pricing. A definitive answer (sold out, empty cart) is shown as the server phrased it, with
 * the way back to the catalog — retrying can't help. Transient failures (5xx, network) can be retried.
 */
export function QuoteError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const definitive = isApiError(error) && !error.transient
  return (
    <div role="alert" className="flex flex-col gap-3 text-sm" data-testid="quote-error">
      {definitive ? translateMessage(error.message) : t.cart.summaryError}
      {definitive ? (
        <Link to="/" hash="catalogo" className="font-bold text-text-accent underline">
          {t.cart.explore}
        </Link>
      ) : (
        <Button type="button" variant="outline" onClick={onRetry}>
          {t.cart.retry}
        </Button>
      )}
    </div>
  )
}
