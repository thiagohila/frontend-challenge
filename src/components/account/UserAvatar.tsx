import type { User } from '@/contracts/auth'
import { cn } from '@/lib/utils'

export function UserAvatar({ user, className }: { user: Pick<User, 'displayName' | 'avatarUrl'>; className?: string }) {
  if (user.avatarUrl) return <img src={user.avatarUrl} alt="" className={cn('size-7 rounded-full object-cover', className)} />
  return (
    <span
      aria-hidden
      className={cn('grid size-7 place-items-center rounded-full bg-surface-raised text-xs font-bold text-text-accent', className)}
    >
      {user.displayName.slice(0, 1).toUpperCase()}
    </span>
  )
}
