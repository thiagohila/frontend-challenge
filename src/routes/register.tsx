import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { AuthDialog } from '@/features/auth/components/AuthDialog'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { authSearchSchema, safeRedirect } from '@/features/auth/redirect'
import { t } from '@/i18n'

export const Route = createFileRoute('/register')({
  validateSearch: authSearchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.session.get().status === 'authenticated') throw redirect({ href: safeRedirect(search.redirect) })
  },
  head: () => ({ meta: [{ title: t.titles.signUp }] }),
  component: RegisterPage,
})

function RegisterPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const goBack = () => navigate({ href: safeRedirect(search.redirect), replace: true })
  return (
    <AuthDialog mode="signUp" search={search} onClose={goBack}>
      <RegisterForm intent={search.intent} onSuccess={goBack} />
    </AuthDialog>
  )
}
