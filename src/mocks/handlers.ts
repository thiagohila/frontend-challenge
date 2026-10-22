import { toSocketIo } from '@mswjs/socket.io-binding'
import { http, HttpResponse, ws } from 'msw'
import { env } from '@/env'
import { accountHandlers } from './handlers/account'
import { catalogHandlers } from './handlers/catalog'
import { commerceHandlers } from './handlers/commerce'

const realtime = ws.link(`${env.socketUrl}/*`)

export const handlers = [
  http.get(`${env.apiUrl}/health`, () => HttpResponse.json({ status: 'ok' })),
  ...catalogHandlers,
  ...accountHandlers,
  ...commerceHandlers,
  // Realtime server (session.hello/ready, ping, broadcast) lands in B5.
  realtime.addEventListener('connection', (connection) => {
    const io = toSocketIo(connection)
    // Handshake is sent by the binding in a microtask; only emit after the client talks.
    io.client.on('hello', () => io.client.emit('ready', { at: new Date().toISOString() }))
  }),
]
