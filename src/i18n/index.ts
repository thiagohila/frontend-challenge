import { prefs, type Locale } from '@/lib/prefs'
import { en } from './en'
import { pt } from './pt'
import type { Dictionary } from './types'

const messages: Readonly<Record<string, string>> = en.messages
const dictionaries: Record<Locale, Dictionary> = { 'pt-BR': pt, 'en-US': en }

/**
 * Resolves against the current locale on every property read, so `t.x` must be read during render
 * (never captured at module scope). The shell remounts on a locale change (see `LocaleBoundary`).
 */
export const t: Dictionary = new Proxy(pt as Dictionary, {
  get: (_, key) => Reflect.get(dictionaries[prefs.get().locale], key),
})

/**
 * Validation messages live in the shared contracts (also used by the mock server) and client-side
 * transport errors in pt-BR: they are the lookup keys. Server-authored messages pass through unchanged.
 */
export function translateMessage(message: string): string {
  return prefs.get().locale === 'en-US' ? (messages[message] ?? message) : message
}

export type { Dictionary }
