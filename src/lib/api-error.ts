import { apiErrorBodySchema, type ErrorCode } from '@/contracts/common'

export type ApiErrorReason = 'http' | 'timeout' | 'network'

/** Normalized error for every REST failure (ARCHITECTURE §5). */
export class ApiError extends Error {
  override readonly name = 'ApiError'
  readonly status: number
  readonly code: ErrorCode
  readonly reason: ApiErrorReason
  readonly fields: Readonly<Record<string, string>>
  readonly details: unknown

  constructor(
    status: number,
    code: ErrorCode,
    message: string,
    reason: ApiErrorReason = 'http',
    fields: Readonly<Record<string, string>> = {},
    details?: unknown,
  ) {
    super(message)
    this.status = status
    this.code = code
    this.reason = reason
    this.fields = fields
    this.details = details
  }

  /** Worth retrying: connectivity, timeouts and 5xx. Never validation/conflict/auth. */
  get transient() {
    return this.reason !== 'http' || this.status >= 500
  }

  static fromResponse(status: number, body: unknown): ApiError {
    const parsed = apiErrorBodySchema.safeParse(body)
    if (!parsed.success) return new ApiError(status, status >= 500 ? 'UNAVAILABLE' : 'VALIDATION', 'Resposta inesperada do servidor.')
    const { code, message, fields, details } = parsed.data.error
    return new ApiError(status, code, message, 'http', fields ?? {}, details)
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError
