import { useNavigate } from '@tanstack/react-router'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { t } from '@/i18n'
import { useSession } from '@/lib/session/store'
import { signOut } from '../session-actions'
import { LoginForm } from './LoginForm'

/**
 * Session expired mid-flow (navigation or checkout): re-authenticate in place without losing
 * the current route or filled forms (A4). Same user → queries refetch; another user → full switch.
 */
export function ReauthDialog() {
  const state = useSession()
  const navigate = useNavigate()
  if (state.status !== 'expired') return null

  return (
    <Dialog open onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(500px,calc(100vw-2rem))] max-w-none rounded-lg border border-border bg-card p-8"
      >
        <DialogTitle className="text-xl font-bold">{t.auth.reauthTitle}</DialogTitle>
        <DialogDescription className="text-sm leading-6 text-muted-foreground">{t.auth.reauthBody}</DialogDescription>
        <LoginForm compact defaultEmail={state.user.email} onSuccess={() => undefined} />
        <button
          type="button"
          onClick={() => void signOut(() => navigate({ to: '/login' }))}
          className="text-sm text-text-accent underline-offset-4 hover:underline"
        >
          {t.auth.reauthSignOut}
        </button>
      </DialogContent>
    </Dialog>
  )
}
