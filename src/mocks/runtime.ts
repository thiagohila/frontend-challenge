import { type FailureResponse, type FailureRule, isScenarioName, type Scenario, type ScenarioName, scenarios } from './scenarios'
import { createRandom } from './server/random'

/**
 * Mutable mock-server settings (scenario, latency override, injected failures).
 * Persisted per tab in sessionStorage so a reload keeps the same conditions (C6).
 */
const STORAGE_KEY = 'msw-server-runtime'

interface RuntimeState {
  scenario: ScenarioName
  latency: number | readonly [number, number] | null
  failures: FailureRule[]
  consumedFlags: string[]
  orderResolutionMs?: number | null
}

const JITTER_SEED = 42
let random = createRandom(JITTER_SEED)
/** A `?scenario=` different from the tab's current one: its seed must replace the stored database. */
let scenarioChangedOnLoad = false

function load(): RuntimeState {
  const fromUrl = new URLSearchParams(window.location.search).get('scenario')
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const saved = raw ? (JSON.parse(raw) as RuntimeState) : null
    if (fromUrl && isScenarioName(fromUrl) && fromUrl !== saved?.scenario) {
      scenarioChangedOnLoad = Boolean(saved) || fromUrl !== 'default'
      return fresh(fromUrl)
    }
    if (saved && isScenarioName(saved.scenario)) return saved
  } catch {
    // corrupted state: start over
  }
  return fresh(fromUrl && isScenarioName(fromUrl) ? fromUrl : 'default')
}

const fresh = (scenario: ScenarioName): RuntimeState => ({ scenario, latency: null, failures: [], consumedFlags: [] })

let state = load()
const save = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable: keep in memory only
  }
}
save()

const globToRegExp = (glob: string) => new RegExp(`^${glob.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`)

export const runtime = {
  get scenarioName() {
    return state.scenario
  },
  get scenario(): Scenario {
    return scenarios[state.scenario]
  },
  /** Fresh conditions for `name`: no overrides, failures or consumed one-shot flags; jitter restarts. */
  setScenario(name: ScenarioName) {
    state = fresh(name)
    random = createRandom(JITTER_SEED)
    save()
  },
  /** True once if this load switched scenario through the URL (the db is then reseeded). */
  takeScenarioChange() {
    const changed = scenarioChangedOnLoad
    scenarioChangedOnLoad = false
    return changed
  },
  setLatency(latency: number | readonly [number, number] | null) {
    state.latency = latency
    save()
  },
  addFailure(rule: FailureRule) {
    state.failures.push(rule)
    save()
  },
  get orderResolutionMs(): number | null {
    return state.orderResolutionMs ?? null
  },
  setOrderResolution(ms: number | null) {
    state.orderResolutionMs = ms
    save()
  },
  clearFailures() {
    state.failures = []
    save()
  },
  /** One-shot scenario flags (e.g. price change happens on the first checkout only). */
  consumeFlag(flag: string): boolean {
    if (state.consumedFlags.includes(flag)) return false
    state.consumedFlags.push(flag)
    save()
    return true
  },
  nextDelay(): number {
    const latency = state.latency ?? this.scenario.latency
    if (typeof latency === 'number') return latency
    const [min, max] = latency
    return min + Math.round(random.next() * (max - min))
  },
  /** Injected (control API) rules win over scenario rules; counted rules are decremented. */
  matchFailure(method: string, path: string): FailureResponse | null {
    const rules: FailureRule[] = [...state.failures, ...(this.scenario.failures ?? [])]
    for (const rule of rules) {
      const methodMatches = rule.method === '*' || rule.method === method
      if (!methodMatches || !globToRegExp(rule.path).test(path)) continue
      if (rule.times !== undefined) {
        if (rule.times <= 0) continue
        rule.times -= 1
        save()
      }
      return rule.response
    }
    return null
  },
}
