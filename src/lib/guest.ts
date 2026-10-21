import { readStorage, removeStorage, writeStorage } from '@/lib/storage'

const GUEST_CART_KEY = 'kurio:guest-cart'

/** Anonymous cart identity (not private data); merged into the user cart on sign-in. */
export const guestCart = {
  id(): string {
    const existing = readStorage<string>('local', GUEST_CART_KEY)
    if (existing) return existing
    const created = crypto.randomUUID()
    writeStorage('local', GUEST_CART_KEY, created)
    return created
  },
  peek: () => readStorage<string>('local', GUEST_CART_KEY),
  forget: () => removeStorage('local', GUEST_CART_KEY),
}
