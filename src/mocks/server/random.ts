/** Deterministic PRNG (mulberry32) — fixtures and jitter are reproducible (REQUIREMENTS M3). */
export function createRandom(seed: number) {
  let value = seed >>> 0
  const next = () => {
    value = (value + 0x6d2b79f5) >>> 0
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    pick: <T>(items: readonly T[]): T => {
      const item = items[Math.floor(next() * items.length)]
      if (item === undefined) throw new Error('pick from empty list')
      return item
    },
  }
}
