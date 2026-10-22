import { useState } from 'react'
import { toast } from 'sonner'
import { FormError } from '@/components/form/FormError'
import { FormField } from '@/components/form/FormField'
import { AffixInput, PasswordInput, TextInput } from '@/components/form/TextInput'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/contracts/profile'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { applyApiErrors, useZodForm } from '@/lib/zod-form'
import { profileFormSchema, toProfileFormValues, toProfileUpdate } from '../form'
import { useProfileMutations } from '../queries'
import { AvatarField } from './AvatarField'

/** "Perfil do colecionador" + "Alterar senha" with a single Salvar (Figma). API errors map to fields (A6). */
export function ProfileForm({ userId, profile }: { userId: string; profile: Profile }) {
  const form = useZodForm(profileFormSchema, { defaultValues: toProfileFormValues(profile) })
  const { update, changePassword } = useProfileMutations(userId)
  const [formError, setFormError] = useState<string | null>(null)
  const { errors } = form.formState
  const saving = update.isPending || changePassword.isPending

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      // Password first: a wrong current password (the likeliest failure) must not leave the profile half-saved.
      if (values.currentPassword) {
        await changePassword.mutateAsync({ currentPassword: values.currentPassword, newPassword: values.newPassword })
        toast.success(t.profile.passwordChanged)
      }
      const saved = await update.mutateAsync(toProfileUpdate(values))
      form.reset(toProfileFormValues(saved.profile))
      toast.success(t.profile.saved)
      announce(t.profile.saved)
    } catch (error) {
      setFormError(applyApiErrors(error, form))
    }
  })

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-8">
      <section aria-labelledby="profile-title" className="flex flex-col gap-6">
        <h1 id="profile-title" className="text-base font-bold">
          {t.profile.title}
        </h1>
        <div className="grid gap-x-7 gap-y-6 md:grid-cols-2">
          <FormField label={t.profile.displayName} required error={errors.displayName?.message}>
            <TextInput autoComplete="name" {...form.register('displayName')} />
          </FormField>
          <FormField label={t.profile.username} required error={errors.username?.message}>
            <TextInput autoComplete="username" {...form.register('username')} />
          </FormField>
          <FormField label={t.profile.email} required error={errors.email?.message}>
            <TextInput type="email" autoComplete="email" {...form.register('email')} />
          </FormField>
          <FormField label={t.profile.ensName} error={errors.ensLabel?.message}>
            <AffixInput affix={t.wallets.fields.ensSuffix} {...form.register('ensLabel')} />
          </FormField>
          <FormField label={t.profile.walletAlias} required error={errors.walletAlias?.message}>
            <TextInput {...form.register('walletAlias')} />
          </FormField>
          <AvatarField userId={userId} avatarUrl={profile.avatarUrl} />
        </div>
      </section>

      <section aria-labelledby="password-title" className="flex flex-col gap-6 md:max-w-[417px]">
        <h2 id="password-title" className="text-base font-bold">
          {t.profile.passwordTitle}
        </h2>
        <FormField label={t.profile.currentPassword} error={errors.currentPassword?.message}>
          <PasswordInput autoComplete="current-password" {...form.register('currentPassword')} />
        </FormField>
        <FormField label={t.profile.newPassword} error={errors.newPassword?.message}>
          <PasswordInput autoComplete="new-password" {...form.register('newPassword')} />
        </FormField>
        <FormField label={t.profile.confirmPassword} error={errors.confirmPassword?.message}>
          <PasswordInput autoComplete="new-password" {...form.register('confirmPassword')} />
        </FormField>
      </section>

      <FormError message={formError} />
      <Button type="submit" disabled={saving} className="h-10 w-[131px] rounded-[3px] font-bold">
        {saving ? t.form.saving : t.profile.save}
      </Button>
    </form>
  )
}
