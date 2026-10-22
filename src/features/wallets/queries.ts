import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Wallet, WalletInput } from '@/contracts/wallet'
import { queryKeys } from '@/lib/query-keys'
import { walletsApi } from './api'

export const walletsQuery = (userId: string) =>
  queryOptions({ queryKey: queryKeys.wallets(userId), queryFn: ({ signal }) => walletsApi.list(signal) })

export function useSaveWallet(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: WalletInput }) => (id ? walletsApi.update(id, input) : walletsApi.create(input)),
    onSuccess: (saved) => {
      queryClient.setQueryData<Wallet[]>(queryKeys.wallets(userId), (current = []) => [...current.filter((wallet) => wallet.id !== saved.id), saved])
      return queryClient.invalidateQueries({ queryKey: queryKeys.wallets(userId) })
    },
  })
}
