import { z } from '@/lib/z'
import { money as moneySchema, networkSchema } from '@/contracts/common'
import { money } from '@/lib/money'
import { catalogSortSchema, catalogTabSchema, collectionSlugSchema, type NftListQuery } from '@/contracts/nft'

/**
 * Catalog state lives in the URL (C1): survives refresh and history. Every field `.catch`es so a
 * hand-edited/stale URL degrades to defaults instead of crashing (direct access, I9).
 */
// The router parses `?priceMin=1` as a number: accept it as a decimal string (shared links, hand-typed URLs).
const urlMoney = z.preprocess((value) => (typeof value === 'number' ? String(value) : value), moneySchema)

export const catalogSearchSchema = z.object({
  q: z.string().trim().max(80).optional().catch(undefined),
  collection: z.array(collectionSlugSchema).optional().catch(undefined),
  network: z.array(networkSchema).optional().catch(undefined),
  priceMin: urlMoney.optional().catch(undefined),
  priceMax: urlMoney.optional().catch(undefined),
  tab: catalogTabSchema.optional().catch(undefined),
  sort: catalogSortSchema.optional().catch(undefined),
  page: z.number().int().min(1).optional().catch(undefined),
})
export type CatalogSearch = z.infer<typeof catalogSearchSchema>

export const CATALOG_PAGE_SIZE = 9

/** A URL carrying catalog state (search, filters, tab, sort or page): a shared/bookmarked market view. */
export const hasCatalogState = (search: CatalogSearch) => Object.values(search).some((value) => value !== undefined)

export const toListQuery = (search: CatalogSearch): NftListQuery => {
  const { priceMin, priceMax } = search
  // An inverted range (hand-edited URL) is read as the range it obviously means.
  const inverted = priceMin !== undefined && priceMax !== undefined && money.compare(priceMin, priceMax) > 0
  return { ...search, ...(inverted && { priceMin: priceMax, priceMax: priceMin }), pageSize: CATALOG_PAGE_SIZE }
}

/** Any filter change resets pagination (C2). */
export const withFilters =
  (patch: Partial<Omit<CatalogSearch, 'page'>>) =>
  (previous: CatalogSearch): CatalogSearch => {
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
