import { type PasswordChange, type ProfileUpdate, profileSchema } from '@/contracts/profile'
import { userSchema } from '@/contracts/auth'
import { z } from 'zod'
import { http } from '@/lib/http'

const profileUpdateResponseSchema = z.object({ profile: profileSchema, user: userSchema })

export const profileApi = {
  get: async (signal?: AbortSignal) => profileSchema.parse((await http.get('/me/profile', { signal })).data),
  update: async (input: ProfileUpdate) => profileUpdateResponseSchema.parse((await http.patch('/me/profile', input)).data),
  setAvatar: async (dataUrl: string) => profileUpdateResponseSchema.parse((await http.put('/me/avatar', { dataUrl })).data),
  removeAvatar: async () => profileUpdateResponseSchema.parse((await http.delete('/me/avatar')).data),
  changePassword: async (input: PasswordChange) => {
    await http.post('/me/password', input)
  },
}
