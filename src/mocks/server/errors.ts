import type { ErrorCode } from '@/contracts/common'

/** Thrown by services; the MSW layer turns it into the error envelope (ARCHITECTURE §4). */
export class HttpError extends Error {
  readonly status: number
  readonly code: ErrorCode
  readonly fields: Record<string, string> | undefined
  readonly details: unknown

  constructor(status: number, code: ErrorCode, message: string, extra: { fields?: Record<string, string>; details?: unknown } = {}) {
    super(message)
    this.status = status
    this.code = code
    this.fields = extra.fields
    this.details = extra.details
  }
}

export const notFound = (what = 'Recurso') => new HttpError(404, 'NOT_FOUND', `${what} não encontrado.`)
export const unauthorized = () => new HttpError(401, 'UNAUTHORIZED', 'Faça login para continuar.')
export const sessionExpired = () => new HttpError(401, 'SESSION_EXPIRED', 'Sua sessão expirou. Entre novamente.')
export const forbidden = (message = 'Sua conta não tem permissão para esta ação.') => new HttpError(403, 'FORBIDDEN', message)
export const validation = (fields: Record<string, string>, message = 'Verifique os campos destacados.') =>
  new HttpError(422, 'VALIDATION', message, { fields })
