import { z } from 'zod'

// Catalog state lives in the URL (REQUIREMENTS C1/C2). Extended in B4.
export const catalogSearchSchema = z.object({
  q: z.string().trim().max(80).optional(),
  collection: z.array(z.string()).optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export type CatalogSearch = z.infer<typeof catalogSearchSchema>
