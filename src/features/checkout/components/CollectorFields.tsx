import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/use-media-query'
import { FormField } from '@/components/form/FormField'
import { inputClassName, TextInput } from '@/components/form/TextInput'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import type { CheckoutFormOutput, CheckoutFormValues } from '../form'

type Form = UseFormReturn<CheckoutFormValues, unknown, CheckoutFormOutput>

/** Figma desktop "Perfil do colecionador". The mobile frame has no form: collapsed there, prefilled from the profile. */
export function CollectorFields({ form }: { form: Form }) {
  const { errors } = form.formState
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const [userOpened, setUserOpened] = useState(false)
  // Open on desktop; on mobile collapsed unless the user opens it or a field is invalid (errors must be reachable).
  const hasFieldErrors = Boolean(errors.displayName ?? errors.username ?? errors.email ?? errors.note)
  const open = isDesktop || userOpened || hasFieldErrors
  return (
    <details
      open={open}
      onToggle={(event) => setUserOpened(event.currentTarget.open)}
      className="group rounded bg-card p-4 lg:bg-transparent lg:p-0 [&[open]>summary~*]:mt-5"
    >
      <summary className="cursor-pointer text-lg font-bold lg:pointer-events-none lg:list-none">{t.checkout.collector}</summary>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <FormField label={t.checkout.displayName} required error={errors.displayName?.message}>
          <TextInput autoComplete="name" {...form.register('displayName')} />
        </FormField>
        <FormField label={t.checkout.username} required error={errors.username?.message}>
          <TextInput autoComplete="username" {...form.register('username')} />
        </FormField>
        <FormField label={t.checkout.email} required error={errors.email?.message}>
          <TextInput type="email" autoComplete="email" {...form.register('email')} />
        </FormField>
        {/* Its own row below the fields, one column wide (same width as the fields above). */}
        <FormField label={t.checkout.note} error={errors.note?.message} className="md:col-start-1">
          <textarea rows={5} className={cn(inputClassName, 'h-auto resize-y py-2')} {...form.register('note')} />
        </FormField>
      </div>
    </details>
  )
}
