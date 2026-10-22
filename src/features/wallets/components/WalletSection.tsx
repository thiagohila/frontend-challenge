import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Wallet, WalletRole } from '@/contracts/wallet'
import { t } from '@/i18n'
import type { WalletFormValues } from '../form'
import { WalletForm } from './WalletForm'

interface WalletSectionProps {
  userId: string
  email: string
  walletRole: WalletRole
  wallet: Wallet | undefined
  /**
   * Secondary only: "Igual à carteira principal". `available` when a primary exists or is being
   * filled in; `source` returns the values to copy (the unsaved primary draft first).
   */
  sameAsPrimary?: { available: boolean; source: () => WalletFormValues | null }
  /** Primary only: lets the page know a primary is being edited and what it holds so far. */
  onEditingChange?: (editing: boolean) => void
  onDraftChange?: (values: WalletFormValues) => void
}

export function WalletSection({
  userId,
  email,
  walletRole: role,
  wallet,
  sameAsPrimary,
  onEditingChange,
  onDraftChange,
}: WalletSectionProps) {
  const [editing, setEditingState] = useState(false)
  const [copied, setCopied] = useState<WalletFormValues | null>(null)
  const checkboxId = useId()
  const setEditing = (next: boolean) => {
    setEditingState(next)
    onEditingChange?.(next)
    if (!next) setCopied(null)
  }
  const toggleSameAsPrimary = (checked: boolean) => {
    const source = checked ? sameAsPrimary?.source() : null
    // The alias names *this* wallet: never copied. Unchecking restores the wallet's own values.
    setCopied(source ? { ...source, alias: '' } : null)
    setEditing(true)
  }
  const title = role === 'primary' ? t.wallets.primary : t.wallets.secondary
  const headingId = `wallet-${role}`

  return (
    <section aria-labelledby={headingId}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={headingId} className="text-lg leading-5 font-bold">
            {title}
          </h2>
          {role === 'primary' && <p className="mt-1 text-sm text-muted-foreground">{t.wallets.description}</p>}
        </div>
        <div className="flex items-center gap-6">
          {sameAsPrimary?.available && (
            <label htmlFor={checkboxId} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                id={checkboxId}
                type="checkbox"
                checked={copied !== null}
                onChange={(event) => toggleSameAsPrimary(event.target.checked)}
                // Figma: a round marker. Still a checkbox (on/off), styled round.
                className="grid size-4 shrink-0 appearance-none place-content-center rounded-full border border-primary before:size-2 before:scale-0 before:rounded-full before:bg-primary before:transition-transform before:content-[''] checked:before:scale-100 motion-reduce:before:transition-none"
              />
              {t.wallets.sameAsPrimary}
            </label>
          )}
          {!editing && (
            <Button
              variant="link"
              onClick={() => setEditing(true)}
              className="h-auto p-0 text-base font-bold text-text-accent"
              aria-describedby={headingId}
            >
              {wallet ? t.wallets.edit : t.wallets.add}
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        <WalletForm
          // Remount on copy/uncopy: the form's default values change.
          key={copied ? 'copied' : 'own'}
          userId={userId}
          walletRole={role}
          wallet={wallet}
          defaultEmail={email}
          initialValues={copied ?? undefined}
          onValuesChange={onDraftChange}
          onDone={() => setEditing(false)}
        />
      ) : wallet ? (
        <dl className="mt-4 grid gap-x-7 gap-y-2 rounded bg-card p-5 text-sm md:grid-cols-2" data-testid={`wallet-${role}`}>
          <WalletDetail label={t.wallets.fields.alias} value={wallet.alias} />
          <WalletDetail label={t.wallets.fields.network} value={t.networks[wallet.network]} />
          <WalletDetail label={t.wallets.fields.walletType} value={t.walletTypes[wallet.walletType]} />
          <WalletDetail label={t.wallets.fields.address} value={`${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}`} />
        </dl>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{role === 'primary' ? t.wallets.emptyPrimary : t.wallets.emptySecondary}</p>
      )}
    </section>
  )
}

function WalletDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted-foreground">{label}:</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
