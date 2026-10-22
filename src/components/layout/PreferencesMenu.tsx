import { ChevronDown } from 'lucide-react'
import { type ReactNode, useEffect, useId, useRef } from 'react'
import { t } from '@/i18n'
import { HOUR_CYCLES, LOCALES, prefs, usePrefs, type HourCycle, type Locale } from '@/lib/prefs'

const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value)
const isHourCycle = (value: string): value is HourCycle => (HOUR_CYCLES as readonly string[]).includes(value)

// A locale change remounts the shell (ADR 18), unmounting the focused select: hand focus back to it.
let refocusLocaleSelect = false

/** Language and time format (extras EX1/EX2). Not in the Figma: native selects, footer placement (ARCH §15). */
export function PreferencesMenu() {
  const current = usePrefs()
  const id = useId()
  const localeSelect = useRef<HTMLSelectElement>(null)
  useEffect(() => {
    if (!refocusLocaleSelect) return
    refocusLocaleSelect = false
    localeSelect.current?.focus()
  }, [])
  // Own chevron (native one hugs the border): room on its right, same look in every browser.
  const selectClass = 'h-8 appearance-none rounded border border-border-soft bg-surface-dark pr-8 pl-2 text-xs text-foreground'

  return (
    <fieldset className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
      <legend className="sr-only">{t.prefs.label}</legend>
      <span className="flex items-center gap-2">
        <label htmlFor={`${id}-locale`}>{t.prefs.language}</label>
        <SelectFrame>
          <select
            ref={localeSelect}
            id={`${id}-locale`}
            value={current.locale}
            onChange={(event) => {
              if (!isLocale(event.target.value)) return
              refocusLocaleSelect = true
              prefs.set({ locale: event.target.value })
            }}
            className={selectClass}
          >
            {LOCALES.map((locale) => (
              // Each language names itself (lang attribute so screen readers pronounce it correctly).
              <option key={locale} value={locale} lang={locale}>
                {t.prefs.languages[locale]}
              </option>
            ))}
          </select>
        </SelectFrame>
      </span>
      <span className="flex items-center gap-2">
        <label htmlFor={`${id}-hour`}>{t.prefs.timeFormat}</label>
        <SelectFrame>
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
        </SelectFrame>
      </span>
    </fieldset>
  )
}

function SelectFrame({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex">
      {children}
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
    </span>
  )
}
