import { type ComponentProps, forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

export const inputClassName =
  'h-10 w-full rounded-[3px] border border-input bg-transparent px-3 text-sm text-foreground placeholder:text-brand-secondary focus-visible:border-primary focus-visible:outline-none aria-[invalid=true]:border-destructive disabled:opacity-50'

export const TextInput = forwardRef<HTMLInputElement, ComponentProps<'input'>>(function TextInput({ className, ...props }, ref) {
  return <input ref={ref} className={cn(inputClassName, className)} {...props} />
})

/**
 * ENS name: suffix select (Figma: ".eth" select, 78 px; only one TLD exists, so it can't change) +
 * the name input. id/aria props land on the <input>; the select names itself for assistive tech.
 */
export const EnsInput = forwardRef<HTMLInputElement, ComponentProps<'input'> & { suffix: string; suffixLabel: string }>(function EnsInput(
  { suffix, suffixLabel, className, ...props },
  ref,
) {
  return (
    <div className="flex gap-2.5">
      <Select value={suffix}>
        <SelectTrigger
          size="field"
          aria-label={suffixLabel}
          className={cn(inputClassName, 'w-[88px] shrink-0 justify-between gap-1 pr-2 pl-2.5 text-sm')}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={suffix}>{suffix}</SelectItem>
        </SelectContent>
      </Select>
      <input ref={ref} className={cn(inputClassName, className)} {...props} />
    </div>
  )
})

/** Password with show/hide toggle (Figma "olho cortado"). */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<ComponentProps<'input'>, 'type'>>(function PasswordInput(
  { className, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input ref={ref} type={visible ? 'text' : 'password'} className={cn(inputClassName, 'pr-11', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-pressed={visible}
        aria-label={visible ? t.form.hidePassword : t.form.showPassword}
        className="absolute inset-y-0 right-0 grid w-10 place-items-center text-brand-secondary hover:text-text-accent"
      >
        {visible ? <Eye aria-hidden className="size-4" /> : <EyeOff aria-hidden className="size-4" />}
      </button>
    </div>
  )
})
