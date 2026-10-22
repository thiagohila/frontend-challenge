import { http, HttpResponse } from 'msw'
import { env } from '@/env'
import { accountHandlers } from './handlers/account'
import { catalogHandlers } from './handlers/catalog'
import { commerceHandlers } from './handlers/commerce'
import { realtimeHandler } from './handlers/realtime'

export const handlers = [
  http.get(`${env.apiUrl}/health`, () => HttpResponse.json({ status: 'ok' })),
  ...catalogHandlers,
  ...accountHandlers,
  ...commerceHandlers,
  realtimeHandler,
]
