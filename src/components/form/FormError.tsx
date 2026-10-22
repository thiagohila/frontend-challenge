import { translateMessage } from '@/i18n'

/** Single form-level alert (API/general errors). Field errors are NOT alerts: they live in aria-describedby. */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {translateMessage(message)}
    </p>
  )
}
