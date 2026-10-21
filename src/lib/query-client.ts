import { QueryClient } from '@tanstack/react-query'
import { isApiError } from '@/lib/api-error'

const MAX_RETRIES = 2

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      // Only transient failures (network, timeout, 5xx) are retried — never 4xx (ARCHITECTURE §6).
      retry: (failureCount, error) => failureCount < MAX_RETRIES && isApiError(error) && error.transient,
      retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 4_000),
    },
    mutations: { retry: false },
  },
})
