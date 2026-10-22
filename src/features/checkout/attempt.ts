import { readStorage, removeStorage, writeStorage } from '@/lib/storage'

/**
 * One purchase attempt = (user, quote). Its Idempotency-Key survives retries, timeouts and reloads,
 * so resubmitting can only ever recover the same order (ARCHITECTURE §5, ADR 14).
 */
interface Attempt {
  quoteId: string
  key: string
}

const storageKey = (userId: string) => `kurio:${userId}:checkout-attempt`

export const checkoutAttempt = {
  keyFor(userId: string, quoteId: string): string {
    const current = readStorage<Attempt>('session', storageKey(userId))
    if (current?.quoteId === quoteId) return current.key
    const next = { quoteId, key: crypto.randomUUID() }
    writeStorage('session', storageKey(userId), next)
    return next.key
  },
  clear: (userId: string) => removeStorage('session', storageKey(userId)),
}
