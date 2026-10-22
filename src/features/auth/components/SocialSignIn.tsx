import { ComingSoon } from '@/components/layout/ComingSoon'
import { t } from '@/i18n'
import { iconSrc } from '@/lib/assets'
import { GoogleLogo } from './GoogleLogo'

const buttonClass =
  'flex h-10 w-full items-center justify-center gap-2 rounded border border-input text-[13px] font-medium text-muted-foreground hover:border-primary'

/** Social sign-in is out of scope: visible as designed, explains it is unavailable (S14). */
export function SocialSignIn() {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-3 text-[13px] text-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        {t.auth.orContinueWith}
      </p>
      <ComingSoon className={buttonClass}>
        <GoogleLogo />
        {t.auth.google}
      </ComingSoon>
      <ComingSoon className={buttonClass}>
        <img src={iconSrc('logo-facebook')} alt="" width={18} height={18} />
        {t.auth.facebook}
      </ComingSoon>
    </div>
  )
}
