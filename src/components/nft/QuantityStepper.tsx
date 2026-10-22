import { Minus, Plus } from 'lucide-react'
import { t } from '@/i18n'
import { iconSrc } from '@/lib/assets'
import { cn } from '@/lib/utils'

/**
 * Figma steppers: `pill` detail page (33×49.5 vertical pills, 26 px glyphs, 20 px value);
 * `pill-sm` cart table (20×30, 16 px glyphs, 17 px value); `round` mobile (25 px circles).
 */
type StepperVariant = 'round' | 'pill' | 'pill-sm'

interface QuantityStepperProps {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
  label: string
  disabled?: boolean
  className?: string
  variant?: StepperVariant
}

const PILL_GLYPHS = {
  pill: { minus: 'icon-minus-lg', plus: 'icon-plus-lg', size: 26 },
  'pill-sm': { minus: 'icon-minus', plus: 'icon-plus', size: 16 },
} as const

const BUTTON_SIZE: Record<StepperVariant, string> = {
  round: 'size-[25px] shadow-[0_4px_6px_rgba(20,13,10,.15)]',
  pill: 'h-[49.5px] w-[33px] border border-ink shadow-[0_6.6px_9.9px_rgba(20,13,10,.15)] disabled:opacity-60',
  'pill-sm': 'h-[30px] w-5 border border-ink shadow-[0_4px_6px_rgba(20,13,10,.15)] disabled:opacity-60',
}

/** Integer quantity within [min, max] (K1). A spinbutton-like group with explicit +/- buttons. */
export function QuantityStepper({ value, min = 1, max, onChange, label, disabled, className, variant = 'round' }: QuantityStepperProps) {
  const glyphs = variant === 'round' ? null : PILL_GLYPHS[variant]
  const button = cn(
    'grid place-items-center rounded-full bg-primary text-ink transition-[background-color,transform] active:scale-95 disabled:bg-border-soft disabled:text-brand-secondary motion-reduce:transition-none',
    BUTTON_SIZE[variant],
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
        {glyphs ? (
          <img src={iconSrc(glyphs.minus)} alt="" width={glyphs.size} height={glyphs.size} />
        ) : (
          <Minus aria-hidden className="size-4" />
        )}
      </button>
      {/* Fixed width for up to 3 digits: the row doesn't shift as the quantity grows. */}
      <output
        aria-live="polite"
        className={cn(
          'min-w-[3ch] text-center tabular-nums',
          variant === 'pill-sm' ? 'text-[17px] leading-6' : 'text-xl',
          variant === 'pill' && 'leading-7',
        )}
      >
        {value}
      </output>
      <button
        type="button"
        className={button}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label={t.detail.increase}
      >
        {glyphs ? (
          <img src={iconSrc(glyphs.plus)} alt="" width={glyphs.size} height={glyphs.size} />
        ) : (
          <Plus aria-hidden className="size-4" />
        )}
      </button>
    </fieldset>
  )
}
