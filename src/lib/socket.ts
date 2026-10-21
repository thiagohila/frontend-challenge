import { io, type Socket } from 'socket.io-client'
import { env } from '@/env'

// websocket-only: MSW intercepts WebSocket, not the HTTP long-polling fallback.
export function createSocket(): Socket {
  return io(env.socketUrl, { transports: ['websocket'], autoConnect: false })
}
