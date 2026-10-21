import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { http } from '@/lib/http'
import { createSocket } from '@/lib/socket'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: async ({ signal }) => (await http.get<{ status: string }>('/health', { signal })).data,
  })
  const [realtime, setRealtime] = useState('connecting')

  useEffect(() => {
    const socket = createSocket()
    socket.on('connect', () => socket.emit('hello'))
    socket.on('ready', () => setRealtime('ok'))
    socket.connect()
    return () => {
      socket.off('connect')
      socket.off('ready')
      socket.disconnect()
    }
  }, [])

  return (
    <main className="mx-auto max-w-xl p-4">
      <h1 className="text-3xl font-bold">NFT Marketplace</h1>
      <p data-testid="api-status">API: {health.data?.status ?? (health.isError ? 'error' : 'loading')}</p>
      <p data-testid="socket-status">Realtime: {realtime}</p>
    </main>
  )
}
