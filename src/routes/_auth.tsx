import { createFileRoute, Outlet } from '@tanstack/react-router'

// Private layout. The session guard (beforeLoad → /login?redirect=) lands in B3.
export const Route = createFileRoute('/_auth')({
  component: Outlet,
})
