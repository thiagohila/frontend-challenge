import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MockPanel } from './MockPanel'

/**
 * Own React root outside `#root`: the panel shares no provider, cache or router with the app,
 * so it can only act through the control API (X5).
 */
export function mountMockPanel() {
  const host = document.createElement('div')
  host.id = 'mock-panel-root'
  document.body.append(host)
  createRoot(host).render(
    <StrictMode>
      <MockPanel />
    </StrictMode>,
  )
}
