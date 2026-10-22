import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/use-media-query'
import { t } from '@/i18n'
import { iconSrc } from '@/lib/assets'
import { cn } from '@/lib/utils'
import type { AuthMode } from '../redirect'

interface AuthDialogProps {
  mode: 'signIn' | 'signUp'
  onClose: () => void
  children: ReactNode
}

/**
 * Figma: desktop = modal over the current page; mobile = full screen with the KURIO wordmark.
 * Radix Dialog provides focus trap, Esc to close and focus restoration (U5).
 */
export function AuthDialog({ mode, onClose, children }: AuthDialogProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const title = mode === 'signIn' ? t.auth.signInTab : isDesktop ? t.auth.signUpTab : t.auth.signUpMobileTitle
  const subtitle = mode === 'signIn' ? t.auth.signInSubtitle : t.auth.signUpSubtitle

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          showCloseButton={false}
          // Start in the first field (not the X): ready to type, and no focus ring on the close icon.
          onOpenAutoFocus={(event) => {
            const field = event.currentTarget instanceof HTMLElement ? event.currentTarget.querySelector<HTMLInputElement>('input') : null
            if (!field) return
            event.preventDefault()
            field.focus()
          }}
          // Figma shows the page behind the modal with no blur.
          overlayClassName="bg-ink/40 supports-backdrop-filter:backdrop-blur-none"
          className={cn(
            'fixed inset-0 z-50 flex max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-y-auto rounded-none border-0 bg-background p-7 shadow-none sm:max-w-none',
            'lg:inset-auto lg:top-1/2 lg:left-1/2 lg:h-auto lg:max-h-[90dvh] lg:min-h-[600px] lg:w-[500px] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bg-card lg:p-0 lg:pb-2.5',
            "lg:after:absolute lg:after:inset-x-0 lg:after:bottom-0 lg:after:h-2.5 lg:after:bg-primary lg:after:content-['']",
          )}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t.auth.close}
            // Figma 9:947: 18 px X, 11 px from the top and 12 px from the right (24 px hit area around it).
            className="absolute top-4 right-4 grid size-8 place-items-center opacity-90 transition-opacity hover:opacity-100 lg:top-2 lg:right-[9px] lg:size-6"
          >
            <img src={iconSrc('icon-close-18')} alt="" width={18} height={18} />
          </button>

          <div className="mx-auto flex w-full max-w-[358px] flex-1 flex-col lg:max-w-[340px] lg:pt-12 lg:pb-10">
            <p className="mt-24 mb-20 text-center text-[32px] font-bold tracking-[0.1em] lg:hidden">{t.brand}</p>

            <DialogTitle className="sr-only">{title}</DialogTitle>
            <p aria-hidden className="text-center text-xl font-bold lg:hidden">
              {title}
            </p>
            {/* Desktop tabs "Entrar | Criar conta" */}
            <nav aria-label={t.auth.signInTab} className="hidden justify-center gap-0 text-xl lg:flex">
              <AuthTab target="login" active={mode === 'signIn'}>
                {t.auth.signInTab}
              </AuthTab>
              <span aria-hidden className="mx-2 w-px bg-coral" />
              <AuthTab target="register" active={mode === 'signUp'}>
                {t.auth.signUpTab}
              </AuthTab>
            </nav>
            <DialogDescription className="mt-12 hidden text-center text-[13px] leading-4 text-foreground lg:mt-10 lg:block">
              {subtitle}
            </DialogDescription>

            <div className="mt-8 lg:mt-6">{children}</div>

            <Link
              to="."
              search={(previous) => ({ ...previous, auth: mode === 'signIn' ? 'register' : 'login' })}
              replace
              className="mt-12 text-center text-sm text-muted-foreground hover:text-text-accent lg:hidden"
            >
              {mode === 'signIn' ? t.auth.toSignUp : t.auth.toSignIn}
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** Switches the dialog in place: only `?auth` changes (no navigation, the page behind stays). */
function AuthTab({ target, active, children }: { target: AuthMode; active: boolean; children: ReactNode }) {
  return (
    <Link
      to="."
      search={(previous) => ({ ...previous, auth: target })}
      replace
      aria-current={active ? 'page' : undefined}
      className={cn('font-medium', active ? 'text-text-accent' : 'text-foreground')}
    >
      {children}
    </Link>
  )
}
