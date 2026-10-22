import type { RealtimeEvent } from '@/contracts/events'
import { runtime } from './runtime'
import { type FailureResponse, type ScenarioName, scenarios } from './scenarios'
import { realtimeControl } from './handlers/realtime'
import { bus } from './server/bus'
import { db, serverContext as ctx } from './server/browser-context'
import { expireSessions } from './server/services/auth'
import { type NftPatch, updateNft } from './server/services/catalog'
import { forceResolveOrder } from './server/services/orders'
import { disconnectWallet } from './server/services/wallets'

/**
 * Admin API of the simulated server (ARCHITECTURE §10 — single source of names).
 * Used by Playwright (`page.evaluate`) and the dev panel. It acts on the *server*:
 * every change reaches the app through REST responses and Socket.IO events, never through app state.
 */
export const mockControl = {
  scenarios: Object.fromEntries(Object.entries(scenarios).map(([name, scenario]) => [name, scenario.description])),
  get scenario() {
    return runtime.scenarioName
  },
  async reset(scenario?: ScenarioName) {
    if (scenario) runtime.setScenario(scenario)
    else runtime.clearFailures()
    await db.reset()
  },
  /** Switching scenario restores its seed (e.g. `empty` has no catalog). */
  async setScenario(name: ScenarioName) {
    runtime.setScenario(name)
    await db.reset()
  },
  fail(path: string, response: FailureResponse, options: { method?: string; times?: number } = {}) {
    runtime.addFailure({
      method: options.method?.toUpperCase() ?? '*',
      path,
      response,
      ...(options.times !== undefined && { times: options.times }),
    })
  },
  clearFailures: () => runtime.clearFailures(),
  setLatency: (latency: number | readonly [number, number] | null) => runtime.setLatency(latency),
  updateNft: (id: string, patch: NftPatch) => updateNft(ctx, id, patch),
  /** Sends an event as-is (duplicates / stale versions for T10). */
  emitRaw: (event: RealtimeEvent) => bus.publish(event),
  /** Closes every socket transport; clients reconnect and reconcile with REST. */
  dropConnection: () => realtimeControl.dropConnections(),
  socketConnections: () => realtimeControl.connectionCount,
  /** Keep new orders pending for `ms` (null = default 3 s) — deterministic pending/recovery tests. */
  setOrderResolution: (ms: number | null) => runtime.setOrderResolution(ms),
  resolveOrder: (id: string, outcome: 'confirmed' | 'declined') => forceResolveOrder(ctx, id, outcome),
  async disconnectWallet(walletId: string) {
    const wallet = (await db.read()).wallets.find((candidate) => candidate.id === walletId)
    if (wallet) await disconnectWallet(ctx, wallet.userId, walletId, 'A carteira foi desconectada.')
  },
  expireSession: (userId?: string) => expireSessions(ctx, userId),
  /** Read-only view of server state, to assert operation results in tests. */
  snapshot: async () => structuredClone(await db.read()),
}

export type MockControl = typeof mockControl

declare global {
  interface Window {
    __mock?: MockControl
  }
}
