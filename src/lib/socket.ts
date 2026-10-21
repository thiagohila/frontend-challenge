import type { Socket } from 'socket.io-client'
import { env } from '@/env'
import { mocksReady } from '@/lib/mocks-ready'

// engine.io-client captures globalThis.WebSocket at module evaluation, and MSW only patches it
// inside worker.start(). So socket.io-client must be imported *after* mocksReady — never statically.
// websocket-only: MSW intercepts WebSocket, not the HTTP long-polling fallback.
export async function createSocket(): Promise<Socket> {
  await mocksReady
  const { io } = await import('socket.io-client')
  return io(env.socketUrl, { transports: ['websocket'], autoConnect: false })
}
