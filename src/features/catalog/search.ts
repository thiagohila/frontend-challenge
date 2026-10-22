import { z } from 'zod'
import { money, networkSchema } from '@/contracts/common'
import { catalogSortSchema, catalogTabSchema, collectionSlugSchema, type NftListQuery } from '@/contracts/nft'

/**
 * Catalog state lives in the URL (C1): survives refresh and history. Every field `.catch`es so a
 * hand-edited/stale URL degrades to defaults instead of crashing (direct access, I9).
 */
export const catalogSearchSchema = z.object({
  q: z.string().trim().max(80).optional().catch(undefined),
  collection: z.array(collectionSlugSchema).optional().catch(undefined),
  network: z.array(networkSchema).optional().catch(undefined),
  priceMin: money.optional().catch(undefined),
  priceMax: money.optional().catch(undefined),
  tab: catalogTabSchema.optional().catch(undefined),
  sort: catalogSortSchema.optional().catch(undefined),
  page: z.number().int().min(1).optional().catch(undefined),
})
export type CatalogSearch = z.infer<typeof catalogSearchSchema>

export const CATALOG_PAGE_SIZE = 9

export const toListQuery = (search: CatalogSearch): NftListQuery => ({ ...search, pageSize: CATALOG_PAGE_SIZE })

/** Any filter change resets pagination (C2). */
export const withFilters = (patch: Partial<Omit<CatalogSearch, 'page'>>) => (previous: CatalogSearch): CatalogSearch => {
  const next: CatalogSearch = { ...previous, ...patch, page: undefined }
  // Drop empty values so the URL stays clean and comparable.
  for (const key of Object.keys(next) as (keyof CatalogSearch)[]) {
    const value = next[key]
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) delete next[key]
  }
  return next
}

export const toggleValue = <T extends string>(values: readonly T[] | undefined, value: T): T[] =>
  values?.includes(value) ? values.filter((item) => item !== value) : [...(values ?? []), value]
