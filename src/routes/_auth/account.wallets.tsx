import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Wallet, WalletRole } from '@/contracts/wallet'
import { WalletForm } from '@/features/wallets/components/WalletForm'
import { walletsQuery } from '@/features/wallets/queries'
import { t } from '@/i18n'
import { useSessionUser } from '@/lib/session/store'

export const Route = createFileRoute('/_auth/account/wallets')({
  head: () => ({ meta: [{ title: 'Carteiras — Kurio' }] }),
  component: WalletsPage,
})

function WalletsPage() {
  const user = useSessionUser()
  const wallets = useQuery({ ...walletsQuery(user?.id ?? ''), enabled: Boolean(user) })
  if (!user) return null

  const byRole = (role: WalletRole) => wallets.data?.find((wallet) => wallet.role === role)

  return (
    <div>
      <h1 className="sr-only">{t.wallets.title}</h1>
      {wallets.isPending ? (
        <div aria-busy className="flex flex-col gap-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : wallets.isError ? (
        <div role="alert" className="flex items-center gap-4 text-sm">
          {t.wallets.loadError}
          <Button variant="outline" onClick={() => void wallets.refetch()}>
            {t.wallets.retry}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <WalletSection userId={user.id} email={user.email} walletRole="primary" wallet={byRole('primary')} />
          <WalletSection userId={user.id} email={user.email} walletRole="secondary" wallet={byRole('secondary')} primary={byRole('primary')} />
        </div>
      )}
    </div>
  )
}

interface WalletSectionProps {
  userId: string
  email: string
  walletRole: WalletRole
  wallet: Wallet | undefined
  primary?: Wallet | undefined
}

function WalletSection({ userId, email, walletRole: role, wallet, primary }: WalletSectionProps) {
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
