import { createFileRoute } from '@tanstack/react-router'

// Scaffold — implemented in its PLAN block.
export const Route = createFileRoute('/_auth/checkout')({
  head: () => ({ meta: [{ title: 'Pagamento — Kurio' }] }),
  component: () => (
    <div className="mx-auto max-w-page px-4 py-8 lg:px-0">
      <h1 className="text-2xl font-bold">Pagamento</h1>
    </div>
  ),
})
