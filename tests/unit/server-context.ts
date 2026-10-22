import type { Scenario } from '../../src/mocks/scenarios'
import type { ServerContext } from '../../src/mocks/server/context'
import { createDb, memoryPersistence } from '../../src/mocks/server/db'
import { createSeed } from '../../src/mocks/server/seed'

/** In-memory simulated server with a controllable clock and manual timers. */
export function createTestServer(flags: NonNullable<Scenario['flags']> = {}) {
  let now = Date.parse('2026-10-21T12:00:00Z')
  const timers: { at: number; callback: () => void }[] = []
  const consumed = new Set<string>()
  const ctx: ServerContext = {
    db: createDb(memoryPersistence(), () => createSeed()),
    now: () => now,
    flags,
    consumeFlag: (flag) => (consumed.has(flag) ? false : (consumed.add(flag), true)),
    schedule: (callback, delayMs) => {
      timers.push({ at: now + delayMs, callback })
    },
  }
  return {
    ctx,
    advance(ms: number) {
      now += ms
      for (const timer of timers.filter((candidate) => candidate.at <= now)) timer.callback()
    },
  }
}
