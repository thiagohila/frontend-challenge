import { Minus, Plus } from 'lucide-react'
import { t } from '@/i18n'
import { iconSrc } from '@/lib/assets'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
  label: string
  disabled?: boolean
  className?: string
  /** `pill`: the detail page's Figma stepper (33×49.5 vertical pills, 26 px glyphs, 20 px value). */
  variant?: 'round' | 'pill'
}

/** Integer quantity within [min, max] (K1). A spinbutton-like group with explicit +/- buttons. */
export function QuantityStepper({ value, min = 1, max, onChange, label, disabled, className, variant = 'round' }: QuantityStepperProps) {
  const pill = variant === 'pill'
  const button = cn(
    'grid place-items-center rounded-full bg-primary text-ink transition-[background-color,transform] active:scale-95 disabled:bg-border-soft disabled:text-brand-secondary motion-reduce:transition-none',
    pill
      ? 'h-[49.5px] w-[33px] border border-ink shadow-[0_6.6px_9.9px_rgba(20,13,10,.15)] disabled:opacity-60'
      : 'size-[25px] shadow-[0_4px_6px_rgba(20,13,10,.15)]',
  )
  return (
    <fieldset className={cn('flex items-center gap-3', className)}>
      <legend className="sr-only">{label}</legend>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label={t.detail.decrease}
      >
        {pill ? <img src={iconSrc('icon-minus-lg')} alt="" width={26} height={26} /> : <Minus aria-hidden className="size-4" />}
      </button>
      <output aria-live="polite" className={cn('min-w-6 text-center text-xl', pill && 'leading-7')}>
        {value}
      </output>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label={t.detail.increase}
      >
        {pill ? <img src={iconSrc('icon-plus-lg')} alt="" width={26} height={26} /> : <Plus aria-hidden className="size-4" />}
      </button>
    </fieldset>
  )
}
