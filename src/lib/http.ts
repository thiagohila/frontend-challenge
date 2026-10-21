import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/env'
import { ApiError } from '@/lib/api-error'
import { guestCart } from '@/lib/guest'
import { mocksReady } from '@/lib/mocks-ready'
import { session } from '@/lib/session/store'

const DEFAULT_TIMEOUT_MS = 10_000

declare module 'axios' {
  interface AxiosRequestConfig {
    /** JS-timer timeout (controllable by Playwright's clock, unlike XHR's native timeout). */
    timeoutMs?: number
  }
  interface InternalAxiosRequestConfig {
    clearTimeoutTimer?: () => void
    timedOut?: () => boolean
  }
}

export const http = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use(async (config) => {
  await mocksReady
  attachTimeout(config)

  const token = session.token()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  else config.headers.set('X-Guest-Cart-Id', guestCart.id())
  return config
})

http.interceptors.response.use(
  (response) => {
    response.config.clearTimeoutTimer?.()
    return response
  },
  (error: unknown) => {
    if (!(error instanceof AxiosError)) return Promise.reject(error)
    error.config?.clearTimeoutTimer?.()

    // Cancellation requested by TanStack Query: propagate untouched so the query ignores it.
    if (axios.isCancel(error) && !error.config?.timedOut?.()) return Promise.reject(error)

    const apiError = toApiError(error)
    const isAuthCall = error.config?.url?.startsWith('/auth/') ?? false
    if (apiError.status === 401 && !isAuthCall) session.expire()
    return Promise.reject(apiError)
  },
)

function attachTimeout(config: InternalAxiosRequestConfig) {
  const controller = new AbortController()
  const upstream = config.signal as AbortSignal | undefined
  if (upstream) {
    if (upstream.aborted) controller.abort(upstream.reason)
    else upstream.addEventListener('abort', () => controller.abort(upstream.reason), { once: true })
  }
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, config.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  config.signal = controller.signal
  config.clearTimeoutTimer = () => clearTimeout(timer)
  config.timedOut = () => timedOut
}

function toApiError(error: AxiosError): ApiError {
  if (error.config?.timedOut?.()) {
    return new ApiError(0, 'UNAVAILABLE', 'O servidor demorou para responder.', 'timeout')
  }
  if (!error.response) return new ApiError(0, 'UNAVAILABLE', 'Sem conexão com o servidor.', 'network')
  return ApiError.fromResponse(error.response.status, error.response.data)
}
