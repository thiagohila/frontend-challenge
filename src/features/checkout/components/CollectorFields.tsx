import type { UseFormReturn } from 'react-hook-form'
import { FormField } from '@/components/form/FormField'
import { inputClassName, TextInput } from '@/components/form/TextInput'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import type { CheckoutFormOutput, CheckoutFormValues } from '../form'

type Form = UseFormReturn<CheckoutFormValues, unknown, CheckoutFormOutput>

/**
 * Figma desktop "Perfil do colecionador". The mobile frame has no form: the values come prefilled from the
 * profile and the section stays hidden there, unless a field is invalid (errors must be reachable).
 */
export function CollectorFields({ form, className }: { form: Form; className?: string }) {
  const { errors } = form.formState
  const hasFieldErrors = Boolean(errors.displayName ?? errors.username ?? errors.email ?? errors.note)
  return (
    <section aria-labelledby="collector-title" className={cn('flex flex-col gap-5', !hasFieldErrors && 'max-lg:hidden', className)}>
      <h2 id="collector-title" className="text-lg font-bold">
        {t.checkout.collector}
      </h2>
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
    </section>
  )
}
