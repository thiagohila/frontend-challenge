import { z } from 'zod'
import { ART_NAMES } from '@/lib/assets.gen'
import { id, isoDate, money, networkSchema, paginated } from './common'

export const artSchema = z.enum(ART_NAMES)

/** Filter facet shown as "Coleções" in the Figma (category of the artwork). */
export const collectionSlugSchema = z.enum([
  'arte-digital',
  'fotografia',
  'musica',
  'arte-3d',
  'colecionaveis',
  'generativa',
  'jogos',
  'assinaturas',
  'utilidade',
])
export type CollectionSlug = z.infer<typeof collectionSlugSchema>

export const editionSchema = z.object({
  id,
  label: z.string(), // "1/1", "1/10", "1/50", "ABERTA"
  supply: z.number().int().positive().nullable(), // null = open edition
  available: z.number().int().min(0),
})
export type Edition = z.infer<typeof editionSchema>

/** Fields needed by cards (catalog, related, cart thumbnails). */
export const nftSummarySchema = z.object({
  id,
  name: z.string(),
  number: z.number().int().min(0),
  art: artSchema,
  priceEth: money,
  compareAtPriceEth: money.nullable(),
  collection: collectionSlugSchema,
  network: networkSchema,
  rarity: z.enum(['common', 'rare']),
  soldOut: z.boolean(),
  version: z.number().int().min(1),
})
export type NftSummary = z.infer<typeof nftSummarySchema>

export const nftDetailSchema = nftSummarySchema.extend({
  tokenId: z.string(),
  series: z.string(),
  creator: z.string(),
  summary: z.string(),
  description: z.array(z.string()),
  attributes: z.array(z.string()),
  rating: z.object({ average: z.number().min(0).max(5), count: z.number().int().min(0) }),
  editions: z.array(editionSchema).min(1),
  maxPerOrder: z.number().int().positive(),
  contract: z.object({ address: z.string(), standard: z.string() }),
  royaltyPct: z.number().min(0).max(100),
  metadataStorage: z.string(),
  updatedAt: isoDate,
})
export type NftDetail = z.infer<typeof nftDetailSchema>

export const catalogTabSchema = z.enum(['all', 'new', 'trending'])
export type CatalogTab = z.infer<typeof catalogTabSchema>

export const catalogSortSchema = z.enum(['recent', 'price-asc', 'price-desc', 'rating'])
export type CatalogSort = z.infer<typeof catalogSortSchema>

/** Query sent to GET /nfts — mirrors the URL search state. */
export const nftListQuerySchema = z.object({
  q: z.string().trim().max(80).optional(),
  collection: z.array(collectionSlugSchema).optional(),
  network: z.array(networkSchema).optional(),
  priceMin: money.optional(),
  priceMax: money.optional(),
  tab: catalogTabSchema.optional(),
  sort: catalogSortSchema.optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(48).optional(),
})
export type NftListQuery = z.infer<typeof nftListQuerySchema>

const facetSchema = <T extends z.ZodType>(value: T) => z.array(z.object({ value, count: z.number().int().min(0) }))

export const nftListResponseSchema = paginated(nftSummarySchema).extend({
  facets: z.object({
    collections: facetSchema(collectionSlugSchema),
    networks: facetSchema(networkSchema),
    price: z.object({ min: money, max: money }),
  }),
})
export type NftListResponse = z.infer<typeof nftListResponseSchema>

export const featuredResponseSchema = z.object({
  hero: z.array(nftSummarySchema).min(1),
  spotlight: nftSummarySchema,
})
export type FeaturedResponse = z.infer<typeof featuredResponseSchema>

export const relatedResponseSchema = z.object({ items: z.array(nftSummarySchema) })
