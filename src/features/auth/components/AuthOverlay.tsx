import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useSession } from '@/lib/session/store'
import { safeRedirect } from '../redirect'
import { AuthDialog } from './AuthDialog'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

/**
 * Sign-in / sign-up as a dialog *over the current page* (`?auth=login|register` on any route): the
 * content behind stays mounted, and switching tabs only swaps the search param (no navigation).
 */
export function AuthOverlay() {
  const search = useSearch({ from: '__root__' })
  const session = useSession()
  const navigate = useNavigate()
  const signedIn = session.status === 'authenticated'

  // Already signed in (reload after an API sign-in, another tab…) with the dialog still in the URL:
  // carry on to where the sign-in was meant to lead, or just drop the param.
  useEffect(() => {
    if (!signedIn || !search.auth) return
    if (search.redirect) void navigate({ href: safeRedirect(search.redirect), replace: true })
    else void navigate({ to: '.', search: (previous) => ({ ...previous, auth: undefined, intent: undefined }), replace: true })
  }, [signedIn, search.auth, search.redirect, navigate])

  if (!search.auth || signedIn) return null

  const close = () =>
    void navigate({
      to: '.',
      search: (previous) => ({ ...previous, auth: undefined, redirect: undefined, intent: undefined }),
      replace: true,
    })
  // After signing in: the requested destination (e.g. /checkout from the cart), else stay where you were.
  const done = () => (search.redirect ? void navigate({ href: safeRedirect(search.redirect), replace: true }) : close())

  return search.auth === 'register' ? (
    <AuthDialog mode="signUp" onClose={close}>
      <RegisterForm intent={search.intent} onSuccess={done} />
    </AuthDialog>
  ) : (
    <AuthDialog mode="signIn" onClose={close}>
      <LoginForm intent={search.intent} onSuccess={done} />
    </AuthDialog>
  )
}
