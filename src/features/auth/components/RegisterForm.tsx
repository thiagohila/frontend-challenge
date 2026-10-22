import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { FormError } from '@/components/form/FormError'
import { FormField } from '@/components/form/FormField'
import { PasswordInput, TextInput } from '@/components/form/TextInput'
import { Button } from '@/components/ui/button'
import { registerFormSchema } from '@/contracts/auth'
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/use-media-query'
import { t } from '@/i18n'
import { applyApiErrors, useZodForm } from '@/lib/zod-form'
import { authApi } from '../api'
import type { Intent } from '../redirect'
import { completeSignIn } from '../session-actions'
import { SocialSignIn } from './SocialSignIn'

const inputClass = 'h-[50px] lg:h-10'

export function RegisterForm({ intent, onSuccess }: { intent?: Intent | undefined; onSuccess: () => void }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const [formError, setFormError] = useState<string | null>(null)
  const form = useZodForm(registerFormSchema, { defaultValues: { username: '', email: '', password: '', confirmPassword: '' } })
  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (response) => {
      await completeSignIn(response, intent)
      onSuccess()
    },
    // 409 conflict maps to the username/email fields (S10).
    onError: (error) => setFormError(applyApiErrors(error, form)),
  })
  const { errors } = form.formState

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(({ confirmPassword: _confirm, ...values }) => {
        setFormError(null)
        register.mutate(values)
      })}
      className="flex flex-col gap-3"
    >
      <FormField label={t.auth.username} hideLabel error={errors.username?.message}>
        <TextInput autoComplete="username" placeholder={t.auth.username} className={inputClass} {...form.register('username')} />
      </FormField>
      <FormField label={t.auth.email} hideLabel error={errors.email?.message}>
        <TextInput type="email" autoComplete="email" placeholder={t.auth.emailSignUpPlaceholder} className={inputClass} {...form.register('email')} />
      </FormField>
      <FormField label={t.auth.password} hideLabel error={errors.password?.message}>
        <PasswordInput autoComplete="new-password" placeholder={t.auth.password} className={inputClass} {...form.register('password')} />
      </FormField>
      <FormField label={t.auth.confirmPassword} hideLabel error={errors.confirmPassword?.message}>
        <PasswordInput autoComplete="new-password" placeholder={t.auth.confirmPassword} className={inputClass} {...form.register('confirmPassword')} />
      </FormField>
      <FormError message={formError} />
      <Button type="submit" disabled={register.isPending} className="mt-5 h-[60px] rounded-[10px] text-base font-bold lg:h-[45px] lg:rounded-md">
        {register.isPending ? t.auth.submitting : isDesktop ? t.auth.submitSignUp : t.auth.submitSignUpMobile}
      </Button>
      <div className="mt-8">
        <SocialSignIn />
      </div>
    </form>
  )
}
