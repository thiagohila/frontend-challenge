import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { ComingSoon } from '@/components/layout/ComingSoon'
import { FormError } from '@/components/form/FormError'
import { FormField } from '@/components/form/FormField'
import { PasswordInput, TextInput } from '@/components/form/TextInput'
import { Button } from '@/components/ui/button'
import { loginRequestSchema } from '@/contracts/auth'
import { t } from '@/i18n'
import { applyApiErrors, useZodForm } from '@/lib/zod-form'
import { authApi } from '../api'
import type { Intent } from '../redirect'
import { completeSignIn } from '../session-actions'
import { SocialSignIn } from './SocialSignIn'

interface LoginFormProps {
  defaultEmail?: string
  intent?: Intent | undefined
  onSuccess: () => void
  /** Re-auth dialog hides the social block and the "forgot password" link. */
  compact?: boolean
}

export function LoginForm({ defaultEmail = '', intent, onSuccess, compact }: LoginFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const form = useZodForm(loginRequestSchema, { defaultValues: { email: defaultEmail, password: '' } })
  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (response) => {
      await completeSignIn(response, intent)
      onSuccess()
    },
    onError: (error) => setFormError(applyApiErrors(error, form)),
  })
  const { errors } = form.formState

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => {
        setFormError(null)
        login.mutate(values)
      })}
      className="flex flex-col gap-3"
    >
      <FormField label={t.auth.email} hideLabel error={errors.email?.message}>
        <TextInput type="email" autoComplete="email" placeholder={t.auth.emailPlaceholder} className="h-[50px] lg:h-10" {...form.register('email')} />
      </FormField>
      <FormField label={t.auth.password} hideLabel error={errors.password?.message}>
        <PasswordInput autoComplete="current-password" placeholder={t.auth.passwordPlaceholder} className="h-[50px] lg:h-10" {...form.register('password')} />
      </FormField>
      {!compact && (
        <ComingSoon className="self-end text-sm text-text-accent">{t.auth.forgotPassword}</ComingSoon>
      )}
      <FormError message={formError} />
      <Button type="submit" disabled={login.isPending} className="mt-5 h-[60px] rounded-[10px] text-base font-bold lg:h-[45px] lg:rounded-md">
        {login.isPending ? t.auth.submitting : t.auth.submitSignIn}
      </Button>
      {!compact && (
        <div className="mt-8">
          <SocialSignIn />
        </div>
      )}
    </form>
  )
}
