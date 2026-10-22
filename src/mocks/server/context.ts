import type { Scenario } from '../scenarios'
import type { Db } from './db'

/** Everything a service needs; built by the MSW layer in the browser and by unit tests in Node. */
export interface ServerContext {
  db: Db
  now: () => number
  flags: NonNullable<Scenario['flags']>
  consumeFlag: (flag: string) => boolean
  schedule: (callback: () => void, delayMs: number) => void
  /** How long a new order stays pending before the simulated payment resolves. */
  orderResolutionMs: () => number
}

export const iso = (ms: number) => new Date(ms).toISOString()
export const newId = (prefix: string) => `${prefix}_${crypto.randomUUID().slice(0, 12)}`
