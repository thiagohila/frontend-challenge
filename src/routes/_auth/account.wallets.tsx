import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { WalletsManager } from '@/features/wallets/components/WalletsManager'
import { walletsQuery } from '@/features/wallets/queries'
import { t } from '@/i18n'
import { useSessionUser } from '@/lib/session/store'

export const Route = createFileRoute('/_auth/account/wallets')({
  head: () => ({ meta: [{ title: t.titles.wallets }] }),
  component: WalletsPage,
})

function WalletsPage() {
  const user = useSessionUser()
  const wallets = useQuery({ ...walletsQuery(user?.id ?? ''), enabled: Boolean(user) })
  if (!user) return null

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
        <WalletsManager userId={user.id} email={user.email} wallets={wallets.data} />
      )}
    </div>
  )
}
