import type { NftSummary } from '@/contracts/nft'

/** "Emerald Ape #042" — the name format used across the Figma. */
export const nftDisplayName = (nft: Pick<NftSummary, 'name' | 'number'>) => `${nft.name} #${String(nft.number).padStart(3, '0')}`
