import { Check } from 'lucide-react'
import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { networkSchema } from '@/contracts/common'
import { collectionSlugSchema, type NftListResponse } from '@/contracts/nft'
import { t } from '@/i18n'
import { money } from '@/lib/money'
import { cn } from '@/lib/utils'
import { type CatalogSearch, toggleValue } from '../search'

interface CatalogFiltersProps {
  search: CatalogSearch
  facets: NftListResponse['facets'] | undefined
  onChange: (patch: Partial<Omit<CatalogSearch, 'page'>>) => void
}

const ALL_COLLECTIONS = collectionSlugSchema.options
const ALL_NETWORKS = networkSchema.options

/** Figma sidebar: collections, price range and network — combinable, counts from the API facets. */
export function CatalogFilters({ search, facets, onChange }: CatalogFiltersProps) {
  const countOf = <T extends string>(list: { value: T; count: number }[] | undefined, value: T) =>
    list?.find((facet) => facet.value === value)?.count ?? 0

  return (
    <div className="flex flex-col gap-10 bg-card p-5">
      <FilterGroup title={t.catalog.collections}>
        {ALL_COLLECTIONS.map((slug) => (
          <FilterOption
            key={slug}
            label={t.collectionsLabel[slug]}
            count={countOf(facets?.collections, slug)}
            active={search.collection?.includes(slug) ?? false}
            onToggle={() => onChange({ collection: toggleValue(search.collection, slug) })}
          />
        ))}
      </FilterGroup>
      <PriceFilter search={search} facets={facets} onApply={onChange} />
      <FilterGroup title={t.catalog.network}>
        {ALL_NETWORKS.map((network) => (
          <FilterOption
            key={network}
            label={t.networks[network]}
            count={countOf(facets?.networks, network)}
            active={search.network?.includes(network) ?? false}
            onToggle={() => onChange({ network: toggleValue(search.network, network) })}
          />
        ))}
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-lg leading-4 font-bold">{title}</legend>
      <ul className="px-3">{children}</ul>
    </fieldset>
  )
}

function FilterOption({ label, count, active, onToggle }: { label: string; count: number; active: boolean; onToggle: () => void }) {
  return (
    <li>
      {/* Active state is not color-only: check icon + aria-pressed + weight (U8, ARCHITECTURE §15). */}
      <button
        type="button"
        aria-pressed={active}
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between gap-2 text-left text-[15px] leading-10 text-text-accent hover:text-foreground',
          active && 'font-bold text-foreground',
        )}
      >
        <span className="flex items-center gap-2">
          <Check aria-hidden className={cn('size-4', active ? 'opacity-100' : 'opacity-0')} />
          {label}
        </span>
        <span className="font-bold text-text-accent">({count})</span>
      </button>
    </li>
  )
}

function PriceFilter({
  search,
  facets,
  onApply,
}: {
  search: CatalogSearch
  facets: CatalogFiltersProps['facets']
  onApply: CatalogFiltersProps['onChange']
}) {
  // The slider is a numeric UI control; values are converted back to decimal strings (2 places) on apply.
  const bounds: [number, number] = [Number(facets?.price.min ?? '0'), Number(facets?.price.max ?? '20')]
  const [range, setRange] = useState<[number, number] | null>(null)
  const current: [number, number] = range ?? [Number(search.priceMin ?? bounds[0]), Number(search.priceMax ?? bounds[1])]
  const label = t.catalog.priceLabel(money.format(current[0].toFixed(2)), money.format(current[1].toFixed(2)))

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-3 text-lg leading-4 font-bold">{t.catalog.priceRange}</legend>
      <Slider
        min={bounds[0]}
        max={bounds[1]}
        step={0.01}
        minStepsBetweenThumbs={1}
        value={current}
        onValueChange={(value) => setRange([value[0] ?? bounds[0], value[1] ?? bounds[1]])}
        aria-label={t.catalog.priceRange}
        thumbLabels={[t.catalog.priceMin, t.catalog.priceMax]}
      />
      <p className="px-3 text-sm" aria-live="polite">
        {label}
      </p>
      <button
        type="button"
        onClick={() => {
          onApply({ priceMin: current[0].toFixed(2), priceMax: current[1].toFixed(2) })
          setRange(null)
        }}
        className="ml-3 self-start rounded bg-primary px-3 py-1.5 text-base font-bold text-primary-foreground hover:bg-text-accent"
      >
        {t.catalog.apply}
      </button>
    </fieldset>
  )
}
