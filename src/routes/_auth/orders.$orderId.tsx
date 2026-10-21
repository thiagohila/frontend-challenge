import { createFileRoute } from '@tanstack/react-router'

// Scaffold — implemented in its PLAN block.
export const Route = createFileRoute('/_auth/orders/$orderId')({
  head: () => ({ meta: [{ title: 'Confirmação de pedido — Kurio' }] }),
  component: () => (
    <div className="mx-auto max-w-page px-4 py-8 lg:px-0">
      <h1 className="text-2xl font-bold">Confirmação de pedido</h1>
    </div>
  ),
})
