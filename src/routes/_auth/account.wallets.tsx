import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { WalletRole } from '@/contracts/wallet'
import { WalletSection } from '@/features/wallets/components/WalletSection'
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
