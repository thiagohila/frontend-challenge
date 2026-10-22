import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { http } from '@/lib/http'
import { createSocket } from '@/lib/socket'

// Provisional (B0 smoke) — replaced by the real catalog in B4.
export function HomePage() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: async ({ signal }) => (await http.get<{ status: string }>('/health', { signal })).data,
  })
  const [realtime, setRealtime] = useState('connecting')

  useEffect(() => {
    let socket: Awaited<ReturnType<typeof createSocket>> | undefined
    let cancelled = false
    createSocket().then((s) => {
      if (cancelled) return
      socket = s
      s.on('connect', () => s.emit('hello'))
      s.on('ready', () => setRealtime('ok'))
      s.connect()
    })
    return () => {
      cancelled = true
      socket?.off('connect')
      socket?.off('ready')
      socket?.disconnect()
    }
  }, [])

  return (
    <div className="mx-auto max-w-page px-4 py-8 lg:px-0">
      <h1 className="text-3xl font-bold">NFT Marketplace</h1>
      <p data-testid="api-status">API: {health.data?.status ?? (health.isError ? 'error' : 'loading')}</p>
      <p data-testid="socket-status">Realtime: {realtime}</p>
    </div>
  )
}
