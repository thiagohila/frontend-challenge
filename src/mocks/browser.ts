import { setupWorker } from 'msw/browser'
import { mockControl } from './control'
import { handlers } from './handlers'
import { serverContext } from './server/browser-context'
import { rescheduleOrders } from './server/services/orders'

export async function startMockServer() {
  const worker = setupWorker(...handlers)
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
  window.__mock = mockControl
  // Pending orders survive reloads: re-arm their resolution timers (C4).
  await rescheduleOrders(serverContext)
}
