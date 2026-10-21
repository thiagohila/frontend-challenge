// Resolved once the MSW worker is active (or immediately when mocks are off).
// Network layers (axios, socket) await it so the UI can render before the mocks boot.
let resolveReady: () => void = () => {}

export const mocksReady = new Promise<void>((resolve) => {
  resolveReady = resolve
})

export const markMocksReady = () => resolveReady()
