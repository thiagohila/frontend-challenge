import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type CatalogSort, type CatalogTab, catalogSortSchema, catalogTabSchema } from '@/contracts/nft'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

interface CatalogToolbarProps {
  tab: CatalogTab
  sort: CatalogSort
  onTab: (tab: CatalogTab) => void
  onSort: (sort: CatalogSort) => void
}

export function CatalogToolbar({ tab, sort, onTab, onSort }: CatalogToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <fieldset className="flex gap-4 overflow-x-auto text-[15px] leading-4 font-medium whitespace-nowrap lg:gap-5">
        <legend className="sr-only">{t.catalog.tabsLabel}</legend>
        {catalogTabSchema.options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={tab === option}
            onClick={() => onTab(option)}
            className={cn('border-b-2 pb-1.5', tab === option ? 'border-primary text-text-accent' : 'border-transparent text-foreground hover:text-text-accent')}
          >
            {t.catalog.tabs[option]}
          </button>
        ))}
      </fieldset>
      <div className="flex items-center gap-2 text-[15px]">
        <span id="catalog-sort-label">{t.catalog.sortLabel}</span>
        <Select value={sort} onValueChange={(value) => onSort(catalogSortSchema.parse(value))}>
          <SelectTrigger aria-labelledby="catalog-sort-label" className="h-auto w-auto gap-1 border-0 bg-transparent p-0 text-[15px] shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {catalogSortSchema.options.map((option) => (
              <SelectItem key={option} value={option}>
                {t.catalog.sort[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
