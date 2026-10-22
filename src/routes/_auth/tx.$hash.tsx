import { createFileRoute } from '@tanstack/react-router'
import { TransactionView } from '@/features/orders/components/TransactionView'
import { useSessionUser } from '@/lib/session/store'
import { t } from '@/i18n'

export const Route = createFileRoute('/_auth/tx/$hash')({
  head: () => ({ meta: [{ title: t.titles.tx }] }),
  component: TxRoute,
})

function TxRoute() {
  const { hash } = Route.useParams()
  const user = useSessionUser()
  return <div className="mx-auto max-w-page px-4 py-10 lg:px-0">{user && <TransactionView userId={user.id} hash={hash} />}</div>
}
