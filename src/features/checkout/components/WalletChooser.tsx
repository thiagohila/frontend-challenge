import { Link } from '@tanstack/react-router'
import { MoreVertical } from 'lucide-react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { FormError } from '@/components/form/FormError'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { networkSchema } from '@/contracts/common'
import { type Wallet, walletTypeSchema } from '@/contracts/wallet'
import { inputClassName } from '@/components/form/TextInput'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import type { CheckoutFormOutput, CheckoutFormValues } from '../form'
import type { ActiveConnection } from '../queries'

type Form = UseFormReturn<CheckoutFormValues, unknown, CheckoutFormOutput>

interface SavedWalletPickerProps {
  form: Form
  wallets: Wallet[]
}

const shortAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`
const PROVIDER_LETTER = { walletconnect: 'W', metamask: 'M', coinbase: 'C' } as const

/** Saved wallets ("Carteira conectada") + network (P2). */
export function SavedWalletPicker({ form, wallets }: SavedWalletPickerProps) {
  const { errors } = form.formState
  const walletId = form.watch('walletId')

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <legend className="text-lg font-bold">{t.checkout.walletSection}</legend>
          <Link to="/account/wallets" className="text-sm font-bold text-text-accent hover:underline">
            {t.checkout.manageWallets}
          </Link>
        </div>
        {wallets.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t.checkout.noWallets}{' '}
            <Link to="/account/wallets" className="text-text-accent underline">
              {t.checkout.addWallet}
            </Link>
          </p>
        ) : (
          wallets.map((wallet) => (
            <label
              key={wallet.id}
              className={cn(
                'flex cursor-pointer items-start gap-4 rounded-[14px] border bg-card p-4',
                walletId === wallet.id ? 'border-primary shadow-[0_20px_20px_rgba(10,6,4,.45)]' : 'border-transparent',
              )}
            >
              <input
                type="radio"
                value={wallet.id}
                className="mt-1 size-4 accent-primary"
                {...form.register('walletId', { onChange: () => form.setValue('network', wallet.network) })}
              />
              <span className="flex flex-1 flex-col gap-1">
                <span className="font-bold">{wallet.alias}</span>
                <span className="text-sm text-muted-foreground">{wallet.secondaryRef ?? shortAddress(wallet.address)}</span>
                <span className="text-sm text-muted-foreground">{t.checkout.networkOf(t.networks[wallet.network])}</span>
              </span>
              <MoreVertical aria-hidden className="size-4 text-text-accent" />
            </label>
          ))
        )}
        {errors.walletId?.message && <p className="text-xs text-destructive">{errors.walletId.message}</p>}
      </fieldset>

      <div className="flex flex-col gap-2">
        <span id="checkout-network-label" className="text-[15px] font-medium">
          {t.checkout.network}
          <span aria-hidden className="ml-0.5 text-coral">
            *
          </span>
        </span>
        <Controller
          control={form.control}
          name="network"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                size="field"
                aria-labelledby="checkout-network-label"
                aria-invalid={Boolean(errors.network)}
                className={cn(inputClassName, 'justify-between')}
              >
                <SelectValue placeholder={t.wallets.fields.networkPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {networkSchema.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t.networks[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  )
}

interface WalletProviderPickerProps {
  form: Form
  hasWallets: boolean
  connection: ActiveConnection | null
  connecting: boolean
  connectError: string | null
  onConnect: () => void
  onDisconnect: () => void
}

/** "Carteira e rede" provider list + the simulated connect / refuse / disconnect handshake (P3). */
export function WalletProviderPicker({
  form,
  hasWallets,
  connection,
  connecting,
  connectError,
  onConnect,
  onDisconnect,
}: WalletProviderPickerProps) {
  const walletId = form.watch('walletId')
  const network = form.watch('network')
  const isConnected = connection !== null && connection.walletId === walletId && connection.network === network
  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-center text-lg font-bold lg:text-base">{t.checkout.provider}</legend>
        {walletTypeSchema.options.map((provider) => (
          <label
            key={provider}
            className="flex cursor-pointer items-center gap-4 rounded-[14px] border border-border bg-card p-3 has-checked:border-primary lg:rounded-[3px] lg:bg-transparent lg:px-3 lg:py-2.5"
          >
            <span
              aria-hidden
              className="grid size-10 place-items-center rounded-full border border-border-soft bg-surface-raised font-bold text-text-accent lg:hidden"
            >
              {PROVIDER_LETTER[provider]}
            </span>
            <span className="flex-1">{t.walletTypes[provider]}</span>
            {/* Figma: radio on the right with a letter avatar (mobile), on the left without it (desktop). */}
            <input type="radio" value={provider} className="size-4 accent-primary lg:order-first" {...form.register('provider')} />
          </label>
        ))}
      </fieldset>

      <div className="flex flex-wrap items-center gap-3" aria-live="polite">
        {isConnected ? (
          <>
            <p className="text-sm font-bold text-success" data-testid="wallet-status">
              ✓ {t.checkout.connected(t.walletTypes[connection.provider])}
            </p>
            <Button type="button" variant="link" onClick={onDisconnect} className="text-text-accent">
              {t.checkout.disconnect}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={onConnect}
            disabled={connecting || !hasWallets}
            className="border-primary text-text-accent"
          >
            {connecting ? t.checkout.connecting : t.checkout.connect}
          </Button>
        )}
      </div>
      <FormError message={connectError} />
    </div>
  )
}
