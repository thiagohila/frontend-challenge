import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { AuthDialog } from '@/features/auth/components/AuthDialog'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { authSearchSchema, safeRedirect } from '@/features/auth/redirect'

export const Route = createFileRoute('/login')({
  validateSearch: authSearchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.session.get().status === 'authenticated') throw redirect({ href: safeRedirect(search.redirect) })
  },
  head: () => ({ meta: [{ title: 'Entrar — Kurio' }] }),
  component: LoginPage,
})

function LoginPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const goBack = () => navigate({ href: safeRedirect(search.redirect), replace: true })
  return (
    <AuthDialog mode="signIn" search={search} onClose={goBack}>
      <LoginForm intent={search.intent} onSuccess={goBack} />
    </AuthDialog>
  )
}
