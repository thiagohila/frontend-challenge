import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Wallet, WalletRole } from '@/contracts/wallet'
import { t } from '@/i18n'
import { WalletForm } from './WalletForm'

interface WalletSectionProps {
  userId: string
  email: string
  walletRole: WalletRole
  wallet: Wallet | undefined
  primary?: Wallet | undefined
}

export function WalletSection({ userId, email, walletRole: role, wallet, primary }: WalletSectionProps) {
  const [editing, setEditing] = useState(false)
  const title = role === 'primary' ? t.wallets.primary : t.wallets.secondary
  const headingId = `wallet-${role}`

  return (
    <section aria-labelledby={headingId}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={headingId} className="text-lg font-bold leading-5">
            {title}
          </h2>
          {role === 'primary' && <p className="mt-1 text-sm text-muted-foreground">{t.wallets.description}</p>}
        </div>
        {!editing && (
          <Button variant="link" onClick={() => setEditing(true)} className="h-auto p-0 text-base font-bold text-text-accent" aria-describedby={headingId}>
            {wallet ? t.wallets.edit : t.wallets.add}
          </Button>
        )}
      </div>

      {editing ? (
        <WalletForm userId={userId} walletRole={role} wallet={wallet} primary={role === 'secondary' ? primary : undefined} defaultEmail={email} onDone={() => setEditing(false)} />
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
