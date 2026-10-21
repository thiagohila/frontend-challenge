// Web Storage can throw (private mode, quota, disabled) — every access is guarded.
type Area = 'local' | 'session'

const area = (which: Area): Storage | null => {
  try {
    return which === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function readStorage<T>(which: Area, key: string): T | null {
  try {
    const raw = area(which)?.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeStorage(which: Area, key: string, value: unknown) {
  try {
    area(which)?.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`storage write failed for ${key}`, error)
  }
}

export function removeStorage(which: Area, key: string) {
  try {
    area(which)?.removeItem(key)
  } catch {
    // ignore: nothing to remove
  }
}

/** Remove every key with the given prefix (e.g. `kurio:<userId>:`). */
export function removeStorageByPrefix(which: Area, prefix: string) {
  const store = area(which)
  if (!store) return
  for (const key of Object.keys(store)) if (key.startsWith(prefix)) removeStorage(which, key)
}
