import {
  type FieldErrors,
  type FieldValues,
  type Path,
  type Resolver,
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form'
import type { z } from 'zod'
import { isApiError } from '@/lib/api-error'

type Schema = z.ZodType<FieldValues, FieldValues>

/** Builds react-hook-form's nested error tree from zod issue paths (first message per field wins). */
function toFieldErrors<T extends FieldValues>(issues: readonly z.core.$ZodIssue[]): FieldErrors<T> {
  const root: Record<string, unknown> = {}
  for (const issue of issues) {
    const keys = issue.path.map(String)
    const last = keys.pop() ?? 'root'
    let node = root
    for (const key of keys) node = (node[key] ??= {}) as Record<string, unknown>
    node[last] ??= { type: issue.code, message: issue.message }
  }
  // The shape above is exactly FieldErrors<T>; TS cannot infer it from a dynamic walk.
  return root as FieldErrors<T>
}

/** Minimal zod resolver (ADR 2: @hookform/resolvers broke clean installs). */
export function zodResolver<TSchema extends Schema>(schema: TSchema): Resolver<z.input<TSchema>, unknown, z.output<TSchema>> {
  return async (values) => {
    const result = await schema.safeParseAsync(values)
    if (result.success) return { values: result.data, errors: {} }
    return { values: {}, errors: toFieldErrors<z.input<TSchema>>(result.error.issues) }
  }
}

export function useZodForm<TSchema extends Schema>(
  schema: TSchema,
  options: Omit<UseFormProps<z.input<TSchema>, unknown, z.output<TSchema>>, 'resolver'> = {},
) {
  return useForm<z.input<TSchema>, unknown, z.output<TSchema>>({ mode: 'onTouched', ...options, resolver: zodResolver(schema) })
}

/**
 * Maps API field errors (validation/conflict) onto the form (A6) and returns the general message.
 * Only fields that exist in the form are applied — server keys are untrusted input.
 */
export function applyApiErrors<T extends FieldValues, TOutput>(
  error: unknown,
  form: Pick<UseFormReturn<T, unknown, TOutput>, 'getValues' | 'setError'>,
): string {
  if (!isApiError(error)) return 'Algo deu errado. Tente novamente.'
  const values = form.getValues()
  for (const [field, message] of Object.entries(error.fields)) {
    if (Object.hasOwn(values, field)) form.setError(field as Path<T>, { type: 'server', message })
  }
  return error.message
}
