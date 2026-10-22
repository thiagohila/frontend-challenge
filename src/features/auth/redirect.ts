import { z } from '@/lib/z'

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

/** Which auth dialog is open over the current page (`?auth=login|register`), validated at the root route. */
export const authModeSchema = z.enum(['login', 'register'])
export type AuthMode = z.infer<typeof authModeSchema>
export const authOverlaySearchSchema = authSearchSchema.extend({ auth: authModeSchema.optional().catch(undefined) })

/** Same page, with the sign-in dialog open over it and where to go once signed in. */
export function withSignIn(href: string, redirectTo: string): string {
  const url = new URL(href, window.location.origin)
  url.searchParams.set('auth', 'login')
  url.searchParams.set('redirect', redirectTo)
  return `${url.pathname}${url.search}${url.hash}`
}
