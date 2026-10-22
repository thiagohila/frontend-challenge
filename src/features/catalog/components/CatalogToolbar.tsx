import { useLayoutEffect, useRef, useState } from 'react'
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
  const buttons = useRef<Partial<Record<CatalogTab, HTMLButtonElement | null>>>({})
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null)

  // One underline (90% of the active label, left aligned) that slides between tabs.
  useLayoutEffect(() => {
    const button = buttons.current[tab]
    if (!button) return
    const place = () => setMarker({ left: button.offsetLeft, width: button.offsetWidth * 0.9 })
    place()
    const observer = new ResizeObserver(place)
    observer.observe(button)
    return () => observer.disconnect()
  }, [tab])

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* min-w-0: a fieldset defaults to min-inline-size: min-content and would never scroll (320 px). */}
      <fieldset className="relative flex min-w-0 gap-4 overflow-x-auto text-[15px] leading-4 font-medium whitespace-nowrap lg:gap-5">
        <legend className="sr-only">{t.catalog.tabsLabel}</legend>
        {catalogTabSchema.options.map((option) => (
          <button
            key={option}
            ref={(node) => {
              buttons.current[option] = node
            }}
            type="button"
            aria-pressed={tab === option}
            onClick={() => onTab(option)}
            className={cn(
              'pb-1.5 transition-colors duration-200',
              tab === option ? 'text-text-accent' : 'text-foreground hover:text-text-accent',
            )}
          >
            {t.catalog.tabs[option]}
          </button>
        ))}
        {marker && (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 h-0.5 bg-primary transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
            style={{ left: marker.left, width: marker.width }}
          />
        )}
      </fieldset>
      <div className="flex items-center gap-2 text-[15px]">
        <span id="catalog-sort-label">{t.catalog.sortLabel}</span>
        <Select value={sort} onValueChange={(value) => onSort(catalogSortSchema.parse(value))}>
          <SelectTrigger
            aria-labelledby="catalog-sort-label"
            className="h-auto w-auto gap-1 border-0 bg-transparent p-0 text-[15px] shadow-none"
          >
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
