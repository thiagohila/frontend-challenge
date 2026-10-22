import { currentSessionSchema, type LoginRequest, type RegisterRequest, sessionResponseSchema } from '@/contracts/auth'
import { mergeCartResponseSchema } from '@/contracts/cart'
import { http } from '@/lib/http'

export const authApi = {
  login: async (input: LoginRequest) => sessionResponseSchema.parse((await http.post('/auth/login', input)).data),
  register: async (input: RegisterRequest) => sessionResponseSchema.parse((await http.post('/auth/register', input)).data),
  session: async (signal?: AbortSignal) => currentSessionSchema.parse((await http.get('/auth/session', { signal })).data),
  /** Uses the outgoing token explicitly: the local session is already cleared when this runs. */
  logout: async (token: string) => {
    await http.post('/auth/logout', null, { headers: { Authorization: `Bearer ${token}` } })
  },
  /** Explicit token: runs before the new session is published (see completeSignIn). */
  mergeGuestCart: async (guestCartId: string, token: string) =>
    mergeCartResponseSchema.parse(
      (await http.post('/cart/merge', { guestCartId }, { headers: { Authorization: `Bearer ${token}` } })).data,
    ),
}
