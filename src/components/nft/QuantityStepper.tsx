import { Minus, Plus } from 'lucide-react'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
  label: string
  disabled?: boolean
  className?: string
}

/** Integer quantity within [min, max] (K1). A spinbutton-like group with explicit +/- buttons. */
export function QuantityStepper({ value, min = 1, max, onChange, label, disabled, className }: QuantityStepperProps) {
  const button = 'grid size-[25px] place-items-center rounded-full bg-primary text-ink shadow-[0_4px_6px_rgba(20,13,10,.15)] disabled:bg-border-soft disabled:text-brand-secondary'
  return (
    <fieldset className={cn('flex items-center gap-3', className)}>
      <legend className="sr-only">{label}</legend>
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={disabled || value <= min} aria-label={t.detail.decrease}>
        <Minus aria-hidden className="size-4" />
      </button>
      <output aria-live="polite" className="min-w-6 text-center text-xl">
        {value}
      </output>
      <button type="button" className={button} onClick={() => onChange(value + 1)} disabled={disabled || value >= max} aria-label={t.detail.increase}>
        <Plus aria-hidden className="size-4" />
      </button>
    </fieldset>
  )
}
