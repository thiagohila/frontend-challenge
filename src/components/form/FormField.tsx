import { type ReactElement, cloneElement, useId } from 'react'
import { translateMessage } from '@/i18n'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  /** Label hidden visually (kept for assistive tech) where the Figma shows none; `'mobile'` = only below lg. */
  hideLabel?: boolean | 'mobile'
  required?: boolean
  error?: string | undefined
  hint?: string
  className?: string
  children: ReactElement<{ id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string; 'aria-required'?: boolean }>
}

/** Label + control + error, wired for a11y: aria-invalid, aria-describedby, role="alert" (U6). */
export function FormField({ label, hideLabel, required, error, hint, className, children }: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={id}
        className={cn('text-[15px] leading-4 font-medium', hideLabel === true && 'sr-only', hideLabel === 'mobile' && 'max-lg:sr-only')}
      >
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-coral">
            *
          </span>
        )}
      </label>
      {cloneElement(children, { id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy, 'aria-required': required })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        // Not role="alert": a submit with many errors would flood screen readers. Focus moves to the
        // first invalid field (react-hook-form) and its error is read via aria-describedby.
        <p id={errorId} className="flex items-center gap-1 text-xs text-destructive">
          <span aria-hidden>⚠</span>
          {translateMessage(error)}
        </p>
      )}
    </div>
  )
}
