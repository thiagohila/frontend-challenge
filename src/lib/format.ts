import { type Prefs, prefs } from '@/lib/prefs'

const cache = new Map<string, Intl.DateTimeFormat>()

function formatter({ locale, hourCycle }: Prefs, style: 'date' | 'datetime') {
  const key = `${locale}|${hourCycle}|${style}`
  let fmt = cache.get(key)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      ...(style === 'datetime' && { timeStyle: 'short' }),
      ...(hourCycle !== 'locale' && { hourCycle }),
    })
    cache.set(key, fmt)
  }
  return fmt
}

/** Callers re-render on preference changes via `usePrefs()` and pass the snapshot explicitly. */
export function formatDateTime(value: string | Date, current: Prefs = prefs.get()) {
  return formatter(current, 'datetime').format(new Date(value))
}

export function formatDate(value: string | Date, current: Prefs = prefs.get()) {
  return formatter(current, 'date').format(new Date(value))
}
