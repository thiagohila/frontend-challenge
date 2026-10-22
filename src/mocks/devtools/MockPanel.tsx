import { useEffect, useRef, useState } from 'react'
import { t } from '@/i18n'
import { CatalogControls, FeeControls, RealtimeAndOrders, ScenarioControls } from './ServerControls'
import { useServerAction } from './use-server-action'

/**
 * "Servidor simulado (admin)" (ARCHITECTURE §10): a floating tab that opens a non-modal side panel,
 * so the page stays visible and realtime changes can be watched as they arrive.
 */
export function MockPanel() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!open) return
    heading.current?.focus()
    // Non-modal panel: Esc closes it from anywhere on the page and returns focus to the tab.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = () => {
    setOpen(false)
    toggle.current?.focus()
  }

  return (
    <div className="font-sans text-[#e2e8f0]">
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls="mock-panel"
        onClick={() => setOpen((value) => !value)}
        // Left edge, vertical: clear of the header, the bottom bars and the cart controls.
        className="fixed top-1/2 left-0 z-[60] -translate-y-1/2 rounded-r bg-[#4f46e5] px-1 py-3 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg [writing-mode:vertical-rl] focus-visible:outline-2 focus-visible:outline-[#a5b4fc]"
      >
        {t.mockPanel.open}
      </button>
      {open && (
        <aside
          id="mock-panel"
          aria-labelledby="mock-panel-title"
          className="fixed inset-y-0 left-0 z-[61] flex w-[min(340px,100vw)] flex-col gap-3 overflow-y-auto border-r-2 border-[#6366f1] bg-[#1e293b] p-4 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 id="mock-panel-title" ref={heading} tabIndex={-1} className="text-sm font-bold outline-none">
              {t.mockPanel.title}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={t.mockPanel.close}
              className="grid size-7 place-items-center rounded hover:bg-[#334155] focus-visible:outline-2 focus-visible:outline-[#a5b4fc]"
            >
              <span aria-hidden>✕</span>
            </button>
          </div>
          <p className="text-xs text-[#94a3b8]">{t.mockPanel.hint}</p>
          <PanelBody />
        </aside>
      )}
    </div>
  )
}

function PanelBody() {
  const { snapshot, status, busy, run } = useServerAction()
  return (
    <>
      <output aria-live="polite" className="min-h-4 text-xs text-[#86efac]" data-testid="mock-panel-status">
        {status}
      </output>
      <ScenarioControls run={run} busy={busy} />
      {snapshot && (
        <>
          <CatalogControls snapshot={snapshot} run={run} busy={busy} />
          <FeeControls run={run} busy={busy} />
          <RealtimeAndOrders snapshot={snapshot} run={run} busy={busy} />
        </>
      )}
    </>
  )
}
