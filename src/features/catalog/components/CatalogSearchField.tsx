import { Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { t } from '@/i18n'
import { CATALOG_SEARCH_ATTRIBUTE } from '@/lib/anchors'
import { cn } from '@/lib/utils'

const DEBOUNCE_MS = 300

/** Debounced search bound to the URL `q` (the URL is the source of truth; local state only while typing). */
export function CatalogSearchField({
  value,
  onSearch,
  className,
}: {
  value: string | undefined
  onSearch: (q: string) => void
  className?: string
}) {
  const [draft, setDraft] = useState(value ?? '')
  const [syncedValue, setSyncedValue] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const id = useId()

  // URL changed elsewhere (history back/forward, "clear filters"): adopt it during render.
  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value ?? '')
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  const onChange = (next: string) => {
    setDraft(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onSearch(next.trim()), DEBOUNCE_MS)
  }

  return (
    <search className={cn('relative block', className)}>
      <label htmlFor={id} className="sr-only">
        {t.catalog.searchLabel}
      </label>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-brand-secondary" />
      <input
        id={id}
        type="search"
        {...{ [CATALOG_SEARCH_ATTRIBUTE]: '' }}
        value={draft}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t.catalog.searchPlaceholder}
        className="h-[45px] w-full rounded-[10px] bg-card pr-3 pl-11 text-sm placeholder:text-brand-secondary focus-visible:outline-2 focus-visible:outline-ring"
      />
    </search>
  )
}
