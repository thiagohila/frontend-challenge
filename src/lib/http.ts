import axios from 'axios'
import { env } from '@/env'
import { mocksReady } from '@/lib/mocks-ready'

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use(async (config) => {
  await mocksReady
  return config
})
