import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { t } from '@/i18n'
import { formatDateTime } from '@/lib/format'
import { formatEth } from '@/lib/money'
import { transactionQuery } from '../queries'

/** Simulated explorer: owner-only, transaction facts only — no purchased items (X4, C5 of the audit). */
export function TransactionView({ userId, hash }: { userId: string; hash: string }) {
  const tx = useQuery(transactionQuery(userId, hash))
  return (
    <section aria-labelledby="tx-title" className="mx-auto flex max-w-[640px] flex-col gap-4 rounded-lg bg-card p-6">
      <h1 id="tx-title" className="text-xl font-bold">
        {t.tx.title}
      </h1>
      <p className="rounded border border-primary/60 bg-primary/10 p-3 text-sm">{t.tx.notice}</p>
      {tx.isPending ? (
        <Skeleton className="h-32 w-full" />
      ) : tx.isError ? (
        <p role="alert">{t.tx.notFound}</p>
      ) : (
        <dl className="grid gap-3 text-sm">
          {[
            [t.tx.hash, tx.data.hash],
            [t.tx.network, t.networks[tx.data.network]],
            [t.tx.status, t.tx.statuses[tx.data.status]],
            [t.tx.total, formatEth(tx.data.totalEth)],
            [t.tx.confirmedAt, tx.data.confirmedAt ? formatDateTime(tx.data.confirmedAt) : '—'],
          ].map(([term, value]) => (
            <div key={term} className="grid gap-1 sm:grid-cols-[160px_1fr]">
              <dt className="font-bold">{term}</dt>
              <dd className="break-all text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <Link to="/" hash="catalogo" className="text-sm text-text-accent hover:underline">
        {t.order.continue}
      </Link>
    </section>
  )
}
