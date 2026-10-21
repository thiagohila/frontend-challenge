import { createFileRoute } from '@tanstack/react-router'

// Scaffold — implemented in its PLAN block.
export const Route = createFileRoute('/cart')({
  head: () => ({ meta: [{ title: 'Carrinho de NFTs — Kurio' }] }),
  component: () => (
    <div className="mx-auto max-w-page px-4 py-8 lg:px-0">
      <h1 className="text-2xl font-bold">Carrinho de NFTs</h1>
    </div>
  ),
})
