import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { FormError } from '@/components/form/FormError'
import { FormField } from '@/components/form/FormField'
import { EnsInput, inputClassName, TextInput } from '@/components/form/TextInput'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { networkSchema } from '@/contracts/common'
import { type Wallet, type WalletRole, walletTypeSchema } from '@/contracts/wallet'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { cn } from '@/lib/utils'
import { applyApiErrors, useZodForm } from '@/lib/zod-form'
import { toFormValues, toWalletInput, type WalletFormValues, walletFormSchema } from '../form'
import { useSaveWallet } from '../queries'

interface WalletFormProps {
  userId: string
  walletRole: WalletRole
  wallet: Wallet | undefined
  defaultEmail: string
  onDone: () => void
  /** Prefill (e.g. "Igual à carteira principal"); defaults to the wallet's own values. */
  initialValues?: WalletFormValues
  /** Reports the draft while typing (the secondary can copy an unsaved primary). */
  onValuesChange?: (values: WalletFormValues) => void
}

export function WalletForm({ userId, walletRole: role, wallet, defaultEmail, onDone, initialValues, onValuesChange }: WalletFormProps) {
  const { fields } = t.wallets
  const [formError, setFormError] = useState<string | null>(null)
  const form = useZodForm(walletFormSchema, { defaultValues: initialValues ?? toFormValues(wallet, defaultEmail) })
  const save = useSaveWallet(userId)
  const { errors } = form.formState
  useEffect(() => {
    if (!onValuesChange) return
    onValuesChange(form.getValues())
    const subscription = form.watch((values) => onValuesChange({ ...form.getValues(), ...values }))
    return () => subscription.unsubscribe()
  }, [form, onValuesChange])

  const submit = form.handleSubmit((values) => {
    setFormError(null)
    save.mutate(
      { ...(wallet && { id: wallet.id }), input: toWalletInput(role, values) },
      {
        onSuccess: () => {
          toast.success(t.wallets.saved)
          announce(t.wallets.saved)
          onDone()
        },
        onError: (error) => setFormError(applyApiErrors(error, form)),
      },
    )
  })

  return (
    <form noValidate onSubmit={submit} className="mt-6 flex flex-col gap-6">
      <div className="grid gap-x-7 gap-y-6 md:grid-cols-2">
        <FormField label={fields.displayName} required error={errors.displayName?.message}>
          <TextInput autoComplete="name" {...form.register('displayName')} />
        </FormField>
        <FormField label={fields.alias} required error={errors.alias?.message}>
          <TextInput {...form.register('alias')} />
        </FormField>
        <FormField label={fields.network} required error={errors.network?.message}>
          <SelectControl
            control={form.control}
            name="network"
            placeholder={fields.networkPlaceholder}
            options={networkSchema.options.map((value) => ({ value, label: t.networks[value] }))}
          />
        </FormField>
        <FormField label={fields.profileName} required error={errors.profileName?.message}>
          <TextInput {...form.register('profileName')} />
        </FormField>
        <FormField label={fields.address} required error={errors.address?.message}>
          <TextInput placeholder={fields.addressPlaceholder} spellCheck={false} autoComplete="off" {...form.register('address')} />
        </FormField>
        <FormField label={fields.secondaryRef} hideLabel error={errors.secondaryRef?.message} className="md:self-end">
          <TextInput placeholder={fields.secondaryRef} {...form.register('secondaryRef')} />
        </FormField>
        <FormField label={fields.walletType} required error={errors.walletType?.message}>
          <SelectControl
            control={form.control}
            name="walletType"
            placeholder={fields.walletTypePlaceholder}
            options={walletTypeSchema.options.map((value) => ({ value, label: t.walletTypes[value] }))}
          />
        </FormField>
        <FormField label={fields.referralCode} required error={errors.referralCode?.message}>
          <TextInput {...form.register('referralCode')} />
        </FormField>
        <FormField label={fields.email} required error={errors.email?.message}>
          <TextInput type="email" autoComplete="email" {...form.register('email')} />
        </FormField>
        <FormField label={fields.ensName} required error={errors.ensLabel?.message}>
          <EnsInput suffix={fields.ensSuffix} suffixLabel={t.wallets.fields.ensDomain} {...form.register('ensLabel')} />
        </FormField>
      </div>
      <FormError message={formError} />
      <div className="flex gap-4">
        <Button type="submit" disabled={save.isPending} className="h-10 rounded-[3px] px-3 font-bold">
          {save.isPending ? t.form.saving : t.wallets.save}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          className="h-10 rounded-[3px] border-primary bg-transparent px-3 font-bold text-text-accent hover:bg-surface-raised"
        >
          {t.wallets.cancel}
        </Button>
      </div>
    </form>
  )
}

interface SelectControlProps {
  control: ReturnType<typeof useZodForm<typeof walletFormSchema>>['control']
  name: 'network' | 'walletType'
  placeholder: string
  options: { value: string; label: string }[]
  id?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

function SelectControl({ control, name, placeholder, options, ...a11y }: SelectControlProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger size="field" {...a11y} onBlur={field.onBlur} className={cn(inputClassName, 'justify-between')}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}
