import { runtime } from '../runtime'
import type { ServerContext } from './context'
import { createDb, type DbState, type Persistence } from './db'
import { createSeed } from './seed'
import { ORDER_RESOLUTION_MS } from './services/orders'

const DB_KEY = 'msw-server-db:v1'

/** The simulated server's storage (holds every user, like a real database). The app never reads it. */
const localPersistence: Persistence = {
  load() {
    try {
      const raw = localStorage.getItem(DB_KEY)
      const state = raw ? (JSON.parse(raw) as DbState) : null
      return state?.schemaVersion === 1 ? state : null
    } catch {
      return null
    }
  },
  save(state) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(state))
    } catch (error) {
      console.warn('[mock] could not persist db', error)
    }
  },
  clear() {
    try {
      localStorage.removeItem(DB_KEY)
    } catch {
      // nothing to clear
    }
  },
}

export const db = createDb(localPersistence, () => createSeed(runtime.scenario.seed))

export const serverContext: ServerContext = {
  db,
  now: () => Date.now(),
  get flags() {
    return runtime.scenario.flags ?? {}
  },
  consumeFlag: (flag) => runtime.consumeFlag(flag),
  schedule: (callback, delayMs) => {
    setTimeout(callback, delayMs)
  },
  orderResolutionMs: () => runtime.orderResolutionMs ?? ORDER_RESOLUTION_MS,
}
