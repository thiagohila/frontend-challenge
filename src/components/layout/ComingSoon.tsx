import type { ComponentProps } from 'react'
import { toast } from 'sonner'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

/**
 * Out-of-scope action kept visible as in the Figma (ARCHITECTURE §11): a real button,
 * marked aria-disabled, that explains it is unavailable — never a fake success.
 */
export function ComingSoon({ className, children, ...props }: Omit<ComponentProps<'button'>, 'onClick' | 'type'>) {
  return (
    <button
      type="button"
      aria-disabled
      title={t.comingSoon}
      onClick={() => toast.info(t.comingSoonToast)}
      className={cn('cursor-not-allowed', className)}
      {...props}
    >
      {children}
    </button>
  )
}
