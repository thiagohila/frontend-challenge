import { createFileRoute } from '@tanstack/react-router'
import { TransactionView } from '@/features/orders/components/TransactionView'
import { useSessionUser } from '@/lib/session/store'

export const Route = createFileRoute('/_auth/tx/$hash')({
  head: () => ({ meta: [{ title: 'Explorador simulado — Kurio' }] }),
  component: TxRoute,
})

function TxRoute() {
  const { hash } = Route.useParams()
  const user = useSessionUser()
  return <div className="mx-auto max-w-page px-4 py-10 lg:px-0">{user && <TransactionView userId={user.id} hash={hash} />}</div>
}
