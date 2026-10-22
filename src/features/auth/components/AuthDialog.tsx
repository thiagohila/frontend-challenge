import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { CatalogHome } from '@/features/catalog/components/CatalogHome'
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/use-media-query'
import { t } from '@/i18n'
import { iconSrc } from '@/lib/assets'
import { cn } from '@/lib/utils'
import type { AuthSearch } from '../redirect'

const noop = () => undefined

interface AuthDialogProps {
  mode: 'signIn' | 'signUp'
  search: AuthSearch
  onClose: () => void
  children: ReactNode
}

/**
 * Figma: desktop = modal over the marketplace page; mobile = full screen with the KURIO wordmark.
 * Radix Dialog provides focus trap, Esc to close and focus restoration (U5).
 */
export function AuthDialog({ mode, search, onClose, children }: AuthDialogProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const title = mode === 'signIn' ? t.auth.signInTab : isDesktop ? t.auth.signUpTab : t.auth.signUpMobileTitle
  const subtitle = mode === 'signIn' ? t.auth.signInSubtitle : t.auth.signUpSubtitle

  return (
    <>
      {isDesktop && (
        <div inert aria-hidden>
          <CatalogHome search={{}} onSearchChange={noop} onClearFilters={noop} />
        </div>
      )}
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
              <AuthTab to="/login" active={mode === 'signIn'} search={search}>
                {t.auth.signInTab}
              </AuthTab>
              <span aria-hidden className="mx-2 w-px bg-coral" />
              <AuthTab to="/register" active={mode === 'signUp'} search={search}>
                {t.auth.signUpTab}
              </AuthTab>
            </nav>
            <DialogDescription className="mt-12 hidden text-center text-[13px] leading-4 text-foreground lg:mt-10 lg:block">
              {subtitle}
            </DialogDescription>

            <div className="mt-8 lg:mt-6">{children}</div>

            <Link
              to={mode === 'signIn' ? '/register' : '/login'}
              search={search}
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

function AuthTab({
  to,
  active,
  search,
  children,
}: {
  to: '/login' | '/register'
  active: boolean
  search: AuthSearch
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      search={search}
      aria-current={active ? 'page' : undefined}
      className={cn('font-medium', active ? 'text-text-accent' : 'text-foreground')}
    >
      {children}
    </Link>
  )
}
