import { createFileRoute, redirect } from '@tanstack/react-router'
import { authSearchSchema, safeRedirect } from '@/features/auth/redirect'

/**
 * Kept for direct links and bookmarks: the dialog itself is an overlay (`?auth=register`, see AuthOverlay),
 * so this route only forwards there (home behind it), or onward when already signed in.
 */
export const Route = createFileRoute('/register')({
  validateSearch: authSearchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.session.get().status === 'authenticated') throw redirect({ href: safeRedirect(search.redirect) })
    throw redirect({ to: '/', search: { auth: 'register', redirect: search.redirect, intent: search.intent }, replace: true })
  },
})
