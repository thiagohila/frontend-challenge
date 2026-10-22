import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { withSignIn } from '@/features/auth/redirect'

// Private area guard (A2). An *expired* session stays on the page: the ReauthDialog resumes in place (A4).
// Anonymous: sign-in opens *over the page the user is on* (e.g. the cart), then continues to the target.
export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (context.session.get().status !== 'anonymous') return
    const from = context.currentPage()
    if (from && from.pathname !== location.pathname) throw redirect({ href: withSignIn(from.href, location.href) })
    // Direct access (or reload) of a private URL: the home page under the dialog.
    throw redirect({ to: '/', search: { auth: 'login', redirect: location.href } })
  },
  component: Outlet,
})
