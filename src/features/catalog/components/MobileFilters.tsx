import { SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { t } from '@/i18n'
import { CatalogFilters } from './CatalogFilters'

type Props = React.ComponentProps<typeof CatalogFilters>

/** Mobile: the sidebar filters live in a drawer (focus trap + Esc via Radix, U5). */
export function MobileFilters(props: Props) {
  const active = (props.search.collection?.length ?? 0) + (props.search.network?.length ?? 0) + (props.search.priceMin ? 1 : 0)
  return (
    <Sheet>
      <SheetTrigger className="relative grid size-[45px] shrink-0 place-items-center rounded-[10px] bg-[linear-gradient(137deg,rgba(210,138,76,.45)_25%,#d28a4c_100%)] text-ink lg:hidden">
        <SlidersHorizontal aria-hidden className="size-5" />
        {/* Name = visible content (WCAG 2.5.3): "Abrir filtros 2 ativos". */}
        <span className="sr-only">{t.catalog.openFilters}</span>
        {active > 0 && (
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-foreground text-[11px] font-bold text-ink">
            {active}
            <span className="sr-only"> {t.catalog.activeFilters}</span>
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-[31px] border-0 bg-card p-0">
        <SheetTitle className="px-5 pt-6 text-lg font-bold">{t.catalog.filters}</SheetTitle>
        <SheetDescription className="sr-only">{t.catalog.filters}</SheetDescription>
        <CatalogFilters {...props} />
      </SheetContent>
    </Sheet>
  )
}
