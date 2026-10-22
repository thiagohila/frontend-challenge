import { useId } from 'react'
import { t } from '@/i18n'
import { HOUR_CYCLES, LOCALES, prefs, usePrefs, type HourCycle, type Locale } from '@/lib/prefs'

const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value)
const isHourCycle = (value: string): value is HourCycle => (HOUR_CYCLES as readonly string[]).includes(value)

/** Language and time format (extras EX1/EX2). Not in the Figma: native selects, footer placement (ARCH §15). */
export function PreferencesMenu() {
  const current = usePrefs()
  const id = useId()
  const selectClass = 'h-8 rounded border border-border-soft bg-surface-dark px-2 text-xs text-foreground'

  return (
    <fieldset className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
      <legend className="sr-only">{t.prefs.label}</legend>
      <span className="flex items-center gap-2">
        <label htmlFor={`${id}-locale`}>{t.prefs.language}</label>
        <select
          id={`${id}-locale`}
          value={current.locale}
          onChange={(event) => isLocale(event.target.value) && prefs.set({ locale: event.target.value })}
          className={selectClass}
        >
          {LOCALES.map((locale) => (
            // Each language names itself (lang attribute so screen readers pronounce it correctly).
            <option key={locale} value={locale} lang={locale}>
              {t.prefs.languages[locale]}
            </option>
          ))}
        </select>
      </span>
      <span className="flex items-center gap-2">
        <label htmlFor={`${id}-hour`}>{t.prefs.timeFormat}</label>
        <select
          id={`${id}-hour`}
          value={current.hourCycle}
          onChange={(event) => isHourCycle(event.target.value) && prefs.set({ hourCycle: event.target.value })}
          className={selectClass}
        >
          {HOUR_CYCLES.map((cycle) => (
            <option key={cycle} value={cycle}>
              {t.prefs.hourCycles[cycle]}
            </option>
          ))}
        </select>
      </span>
    </fieldset>
  )
}
