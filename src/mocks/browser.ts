import { setupWorker } from 'msw/browser'
import { mockControl } from './control'
import { handlers } from './handlers'
import { runtime } from './runtime'
import { db, serverContext } from './server/browser-context'
import { rescheduleOrders } from './server/services/orders'

export async function startMockServer() {
  const worker = setupWorker(...handlers)
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
  window.__mock = mockControl
  // `?scenario=<name>` selects a scenario *with its seed* (e.g. `empty`), like `__mock.setScenario`.
  if (runtime.takeScenarioChange()) await db.reset()
  // Pending orders survive reloads: re-arm their resolution timers (C4).
  await rescheduleOrders(serverContext)
}
