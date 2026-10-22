import { createFileRoute } from '@tanstack/react-router'
import { useCartOwner } from '@/features/cart/queries'
import { OrderView } from '@/features/orders/components/OrderView'
import { useSessionUser } from '@/lib/session/store'
import { t } from '@/i18n'

export const Route = createFileRoute('/_auth/orders/$orderId')({
  head: () => ({ meta: [{ title: t.titles.order }] }),
  component: OrderRoute,
})

function OrderRoute() {
  const { orderId } = Route.useParams()
  const user = useSessionUser()
  const owner = useCartOwner()
  return (
    <div className="mx-auto max-w-page px-4 py-10 lg:px-0">
      {user && <OrderView userId={user.id} orderId={orderId} cartOwner={owner} />}
    </div>
  )
}
