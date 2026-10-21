export type Locale = 'pt-BR' | 'en-US'
export type HourCycle = 'locale' | 'h12' | 'h23'

export interface DateTimePrefs {
  locale: Locale
  hourCycle: HourCycle
}

export const defaultDateTimePrefs: DateTimePrefs = { locale: 'pt-BR', hourCycle: 'locale' }

const cache = new Map<string, Intl.DateTimeFormat>()

function formatter({ locale, hourCycle }: DateTimePrefs, style: 'date' | 'datetime') {
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

export function formatDateTime(value: string | Date, prefs: DateTimePrefs = defaultDateTimePrefs) {
  return formatter(prefs, 'datetime').format(new Date(value))
}

export function formatDate(value: string | Date, prefs: DateTimePrefs = defaultDateTimePrefs) {
  return formatter(prefs, 'date').format(new Date(value))
}
