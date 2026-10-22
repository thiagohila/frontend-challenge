import type { Network } from '@/contracts/common'
import { type WalletInput, walletConnectionSchema, walletListSchema, walletSchema } from '@/contracts/wallet'
import { http } from '@/lib/http'

export const walletsApi = {
  list: async (signal?: AbortSignal) => walletListSchema.parse((await http.get('/me/wallets', { signal })).data).items,
  create: async (input: WalletInput) => walletSchema.parse((await http.post('/me/wallets', input)).data),
  update: async (id: string, input: WalletInput) => walletSchema.parse((await http.patch(`/me/wallets/${id}`, input)).data),
  connect: async (id: string, network: Network) => walletConnectionSchema.parse((await http.post(`/me/wallets/${id}/connect`, { network })).data),
  disconnect: async (id: string) => {
    await http.delete(`/me/wallets/${id}/connect`)
  },
}
