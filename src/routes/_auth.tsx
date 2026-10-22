import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

// Private area guard (A2). An *expired* session stays on the page: the ReauthDialog resumes in place (A4).
export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (context.session.get().status === 'anonymous') {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: Outlet,
})
