import type { QueryClient } from '@tanstack/react-query'
import type { Socket } from 'socket.io-client'
import { realtimeEventSchema, SOCKET_EVENTS } from '@/contracts/events'
import { env } from '@/env'
import { mocksReady } from '@/lib/mocks-ready'
import { queryKeys } from '@/lib/query-keys'
import { type ApplyContext, applyEvent } from './apply'
import { createEventGate } from './gate'

export type RealtimeStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting'

type Applied = Awaited<ReturnType<typeof applyEvent>>
type Listener = () => void

/**
 * One Socket.IO connection per session (ARCHITECTURE §9). Recreated on sign-in/out so events of a
 * previous session can never reach the next user (RT5); listeners are always removed (RT6).
 */
export function createRealtimeManager(queryClient: QueryClient, onApplied: (result: Applied) => void) {
  const gate = createEventGate()
  const listeners = new Set<Listener>()
  let socket: Socket | null = null
  let status: RealtimeStatus = 'idle'
  let generation = 0
  let context: ApplyContext = { userId: null, cartOwner: null }

  const setStatus = (next: RealtimeStatus) => {
    status = next
    for (const listener of listeners) listener()
  }

  /** After a reconnection, REST is the source of truth for everything that may have changed (RT4). */
  async function reconcile() {
    await queryClient.invalidateQueries({ queryKey: queryKeys.nfts.all })
    if (context.cartOwner) {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart(context.cartOwner) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.quotes(context.cartOwner) })
    }
    if (context.userId) await queryClient.invalidateQueries({ queryKey: queryKeys.orders.all(context.userId) })
  }

  function stop() {
    generation += 1
    if (socket) {
      socket.removeAllListeners()
      socket.io.removeAllListeners()
      socket.disconnect()
      socket = null
    }
    gate.reset()
    setStatus('idle')
  }

  async function start(token: string | null, nextContext: ApplyContext) {
    stop()
    context = nextContext
    const current = generation
    setStatus('connecting')
    // socket.io-client must be imported only after MSW patched WebSocket (ADR 12).
    await mocksReady
    const { io } = await import('socket.io-client')
    if (current !== generation) return // superseded by a newer start/stop

    const connection = io(env.socketUrl, { transports: ['websocket'], autoConnect: false })
    socket = connection
    let wasConnected = false

    connection.on('connect', () => connection.emit(SOCKET_EVENTS.hello, token ? { token } : {}))
    connection.on(SOCKET_EVENTS.ready, () => {
      setStatus('connected')
      if (wasConnected) void reconcile()
      wasConnected = true
    })
    connection.on('disconnect', () => setStatus(wasConnected ? 'reconnecting' : 'connecting'))

    for (const name of [SOCKET_EVENTS.nftUpdated, SOCKET_EVENTS.orderUpdated, SOCKET_EVENTS.walletDisconnected]) {
      connection.on(name, async (payload: unknown) => {
        const parsed = realtimeEventSchema.safeParse(payload)
        if (!parsed.success || current !== generation) return
        if (!gate.accept(parsed.data, context.userId)) return
        onApplied(await applyEvent(queryClient, parsed.data, context))
      })
    }
    connection.connect()
  }

  return {
    start,
    stop,
    getStatus: () => status,
    subscribe(listener: Listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export type RealtimeManager = ReturnType<typeof createRealtimeManager>
