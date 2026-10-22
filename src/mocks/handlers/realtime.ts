import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'
import { helloPayloadSchema, SOCKET_EVENTS } from '@/contracts/events'
import { env } from '@/env'
import { bus } from '../server/bus'
import { serverContext } from '../server/browser-context'

/**
 * Socket.IO server simulated with MSW + @mswjs/socket.io-binding (REQUIREMENTS M6/M7).
 * Binding limitations handled here (ARCHITECTURE §10): no rooms → per-user connection map;
 * no server pings → we send raw engine.io pings; handshake in a microtask → reply only after hello.
 */
const PING_INTERVAL_MS = 20_000
const ENGINE_IO_PING = '2'
// Only 1000 and 3000–4999 are accepted by the interceptor; a transport close makes the client reconnect.
const TRANSPORT_DROP_CODE = 4000

interface Connection {
  userId: string | null
  emit: (event: string, payload: unknown) => void
  close: () => void
}

const connections = new Set<Connection>()

async function userIdForToken(token: string | undefined): Promise<string | null> {
  if (!token) return null
  const state = await serverContext.db.read()
  const session = state.sessions.find((candidate) => candidate.token === token)
  return session && Date.parse(session.expiresAt) > serverContext.now() ? session.userId : null
}

// Domain events → sockets. Private events (with userId) only reach that user's connections (RT5, X4).
bus.subscribe((event) => {
  for (const connection of connections) {
    if (event.userId && connection.userId !== event.userId) continue
    connection.emit(event.type, event)
  }
})

export const realtimeControl = {
  /** Simulates a network drop: closes every transport; clients reconnect and reconcile (RT4). */
  dropConnections() {
    for (const connection of connections) connection.close()
  },
  get connectionCount() {
    return connections.size
  },
}

const realtime = ws.link(`${env.socketUrl}/*`)

export const realtimeHandler = realtime.addEventListener('connection', (wsConnection) => {
  const io = toSocketIo(wsConnection)
  const connection: Connection = {
    userId: null,
    emit: (event, payload) => io.client.emit(event, payload),
    close: () => wsConnection.client.close(TRANSPORT_DROP_CODE, 'simulated network drop'),
  }
  connections.add(connection)

  const ping = setInterval(() => wsConnection.client.send(ENGINE_IO_PING), PING_INTERVAL_MS)
  wsConnection.client.addEventListener('close', () => {
    clearInterval(ping)
    connections.delete(connection)
  })

  io.client.on(SOCKET_EVENTS.hello, async (_message, payload: unknown) => {
    const parsed = helloPayloadSchema.safeParse(payload)
    connection.userId = await userIdForToken(parsed.success ? parsed.data.token : undefined)
    io.client.emit(SOCKET_EVENTS.ready, { userId: connection.userId })
  })
})
