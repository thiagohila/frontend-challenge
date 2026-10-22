import { useSyncExternalStore } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'

export const LOCALES = ['pt-BR', 'en-US'] as const
export const HOUR_CYCLES = ['locale', 'h12', 'h23'] as const
export type Locale = (typeof LOCALES)[number]
/** `locale` = the language's own convention (24h in pt-BR, 12h in en-US). */
export type HourCycle = (typeof HOUR_CYCLES)[number]

export interface Prefs {
  locale: Locale
  hourCycle: HourCycle
}

const KEY = 'kurio:prefs'
export const defaultPrefs: Prefs = { locale: 'pt-BR', hourCycle: 'locale' }

// Persisted values are untrusted (older versions, manual edits): keep only known members.
function sanitize(value: Partial<Prefs> | null): Prefs {
  return {
    locale: LOCALES.find((locale) => locale === value?.locale) ?? defaultPrefs.locale,
    hourCycle: HOUR_CYCLES.find((cycle) => cycle === value?.hourCycle) ?? defaultPrefs.hourCycle,
  }
}

let state = sanitize(readStorage<Partial<Prefs>>('local', KEY))
const listeners = new Set<() => void>()

/** Device-level preferences (not per user): language and time format (extras EX1/EX2). */
export const prefs = {
  get: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  set(patch: Partial<Prefs>) {
    const next = sanitize({ ...state, ...patch })
    if (next.locale === state.locale && next.hourCycle === state.hourCycle) return
    state = next
    writeStorage('local', KEY, state)
    for (const listener of listeners) listener()
  },
}

export const usePrefs = () => useSyncExternalStore(prefs.subscribe, prefs.get)
