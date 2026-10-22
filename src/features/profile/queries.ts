import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '@/contracts/auth'
import type { Profile } from '@/contracts/profile'
import { session } from '@/lib/session/store'
import { queryKeys } from '@/lib/query-keys'
import { profileApi } from './api'

export const profileQuery = (userId: string) =>
  queryOptions({ queryKey: queryKeys.profile(userId), queryFn: ({ signal }) => profileApi.get(signal) })

/** Saves update the private profile cache and the session user (header name/avatar) together. */
export function useProfileMutations(userId: string) {
  const queryClient = useQueryClient()
  const onProfile = ({ profile, user }: { profile: Profile; user: User }) => {
    queryClient.setQueryData(queryKeys.profile(userId), profile)
    session.updateUser(user)
  }
  return {
    update: useMutation({ mutationFn: profileApi.update, onSuccess: onProfile }),
    setAvatar: useMutation({ mutationFn: profileApi.setAvatar, onSuccess: onProfile }),
    removeAvatar: useMutation({ mutationFn: profileApi.removeAvatar, onSuccess: onProfile }),
    changePassword: useMutation({ mutationFn: profileApi.changePassword }),
  }
}
