import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProfileForm } from '@/features/profile/components/ProfileForm'
import { profileQuery } from '@/features/profile/queries'
import { t } from '@/i18n'
import { useSessionUser } from '@/lib/session/store'

export const Route = createFileRoute('/_auth/account/profile')({
  head: () => ({ meta: [{ title: t.titles.profile }] }),
  component: ProfileRoute,
})

function ProfileRoute() {
  const user = useSessionUser()
  const profile = useQuery({ ...profileQuery(user?.id ?? ''), enabled: Boolean(user) })
  if (!user) return null
  if (profile.isPending)
    return (
      <div aria-busy="true" className="flex flex-col gap-4">
        <span className="sr-only">{t.catalog.updating}</span>
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  if (profile.isError)
    return (
      <div role="alert" className="flex items-center gap-4">
        {t.profile.loadError}
        <Button variant="outline" onClick={() => void profile.refetch()}>
          {t.cart.retry}
        </Button>
      </div>
    )
  return <ProfileForm userId={user.id} profile={profile.data} />
}
