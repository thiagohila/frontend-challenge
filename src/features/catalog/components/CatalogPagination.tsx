import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'
import type { CatalogSearch } from '../search'

const itemClass = 'grid size-[35px] place-items-center rounded border border-control-border text-lg hover:border-primary'

/** Figma: numbered pages + "next". "Previous" added (sr-friendly, keyboard) only when not on page 1. */
export function CatalogPagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const to =
    (target: number) =>
    (previous: CatalogSearch): CatalogSearch => ({ ...previous, page: target === 1 ? undefined : target })

  return (
    <nav aria-label={t.catalog.pagination} className="flex justify-end">
      <ul className="flex gap-2">
        {page > 1 && (
          <li>
            <Link to="/" search={to(page - 1)} hash="catalogo" aria-label={t.catalog.previousPage} className={itemClass}>
              <ChevronLeft aria-hidden className="size-4" />
            </Link>
          </li>
        )}
        {pages.map((number) => (
          <li key={number}>
            <Link
              to="/"
              search={to(number)}
              hash="catalogo"
              aria-label={t.catalog.page(number)}
              aria-current={number === page ? 'page' : undefined}
              className={cn(itemClass, number === page && 'border-primary bg-primary font-bold text-primary-foreground')}
            >
              {number}
            </Link>
          </li>
        ))}
        {page < totalPages && (
          <li>
            <Link to="/" search={to(page + 1)} hash="catalogo" aria-label={t.catalog.nextPage} className={itemClass}>
              <ChevronRight aria-hidden className="size-4" />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
