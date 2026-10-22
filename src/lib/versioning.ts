import { replaceEqualDeep } from '@tanstack/react-query'

/**
 * `structuralSharing` for versioned resources (Nft, Order): a REST response that started before a
 * realtime event may land after it — never let it regress to an older version (I5, RT3).
 * TanStack types both arguments as `unknown`; the data was already validated by zod in the queryFn.
 */
export function keepNewerVersion<T extends { version: number }>(previous: unknown, next: unknown): T {
  const old = previous as T | undefined
  const fresh = next as T
  return old && old.version > fresh.version ? old : replaceEqualDeep(old, fresh)
}
