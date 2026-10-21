import { createFileRoute } from '@tanstack/react-router'

// Scaffold — implemented in its PLAN block.
export const Route = createFileRoute('/login')({
  head: () => ({ meta: [{ title: 'Entrar — Kurio' }] }),
  component: () => (
    <div className="mx-auto max-w-page px-4 py-8 lg:px-0">
      <h1 className="text-2xl font-bold">Entrar</h1>
    </div>
  ),
})
