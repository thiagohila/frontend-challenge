import { delay, http, HttpResponse, type DefaultBodyType, type PathParams } from 'msw'
import type { z } from 'zod'
import { env } from '@/env'
import { runtime } from '../runtime'
import { serverContext } from '../server/browser-context'
import type { UserRecord } from '../server/db'
import { forbidden, HttpError, validation } from '../server/errors'
import { authenticate } from '../server/services/auth'
import type { CartOwner } from '../server/services/cart'

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface RouteContext {
  request: Request
  params: PathParams
  token: string | null
  /** Resolves the caller from the bearer token (never from client-supplied ids). */
  user(): Promise<UserRecord>
  /** Cart owner: the authenticated user, or the anonymous guest cart from `X-Guest-Cart-Id`. */
  owner(): Promise<CartOwner>
  body<T extends z.ZodType>(schema: T): Promise<z.infer<T>>
}

interface RouteOptions {
  /** Private resource: the `unauthorized` scenario answers 403 here (REQUIREMENTS R2/M5). */
  private?: boolean
}

const bearer = (request: Request) => request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? null

export const errorResponse = (error: HttpError) =>
  HttpResponse.json(
    { error: { code: error.code, message: error.message, fields: error.fields, details: error.details } },
    { status: error.status },
  )

function zodFields(error: z.ZodError) {
  const fields: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form'
    fields[key] ??= issue.message
  }
  return fields
}

/**
 * Wraps every REST handler with the network simulation (latency, injected failures),
 * auth resolution and the error envelope — handlers only express business rules.
 */
export function route(method: Method, path: string, handler: (ctx: RouteContext) => Promise<Response | DefaultBodyType>, options: RouteOptions = {}) {
  return http[method](`${env.apiUrl}${path}`, async ({ request, params }) => {
    const relativePath = new URL(request.url).pathname.replace(env.apiUrl, '')
    await delay(runtime.nextDelay())

    const failure = runtime.matchFailure(method.toUpperCase(), relativePath)
    if (failure === 'network') return HttpResponse.error()
    if (failure === 'timeout') return delay('infinite').then(() => HttpResponse.error())
    if (failure) return errorResponse(new HttpError(failure.status, 'UNAVAILABLE', 'Serviço temporariamente indisponível.'))

    const token = bearer(request)
    const context: RouteContext = {
      request,
      params,
      token,
      async user() {
        const user = await authenticate(serverContext, token)
        if (options.private && serverContext.flags.forbidPrivate) throw forbidden('Acesso não autorizado para esta conta.')
        return user
      },
      async owner() {
        if (token) return { kind: 'user', userId: (await context.user()).id }
        const guestId = request.headers.get('X-Guest-Cart-Id')
        if (!guestId) throw validation({ guest: 'Carrinho de visitante ausente' })
        return { kind: 'guest', guestId }
      },
      async body(schema) {
        const json: unknown = await request.json().catch(() => undefined)
        const parsed = schema.safeParse(json)
        if (!parsed.success) throw validation(zodFields(parsed.error))
        return parsed.data
      },
    }

    try {
      const result = await handler(context)
      return result instanceof Response ? result : HttpResponse.json(result)
    } catch (error) {
      if (error instanceof HttpError) return errorResponse(error)
      console.error('[mock] unhandled handler error', error)
      return errorResponse(new HttpError(500, 'UNAVAILABLE', 'Erro interno do servidor simulado.'))
    }
  })
}
