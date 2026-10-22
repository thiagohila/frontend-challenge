import { z } from 'zod'

/** Only same-origin paths are accepted as post-login destinations (no open redirect). */
export function safeRedirect(value: string | undefined, fallback = '/'): string {
  if (!value) return fallback
  try {
    const url = new URL(value, window.location.origin)
    if (url.origin !== window.location.origin) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

/** Action to resume after signing in from a public screen (ARCHITECTURE §7). Allowlist only. */
export const intentSchema = z.union([z.templateLiteral(['favorite:', z.string().regex(/^[a-z0-9-]+$/)]), z.literal('checkout')])
export type Intent = z.infer<typeof intentSchema>

export const authSearchSchema = z.object({
  redirect: z.string().max(500).optional().catch(undefined),
  intent: intentSchema.optional().catch(undefined),
})
export type AuthSearch = z.infer<typeof authSearchSchema>
