import type { Edition } from '@/contracts/nft'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

/** Single choice among editions; sold-out ones are disabled and say so (not color-only, U8). */
export function EditionPicker({ editions, selectedId, onSelect }: { editions: Edition[]; selectedId: string | undefined; onSelect: (id: string) => void }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-[15px] font-bold">{t.detail.edition}</legend>
      <div className="flex flex-wrap gap-2">
        {editions.map((edition) => {
          const soldOut = edition.available === 0
          const selected = edition.id === selectedId
          return (
            <button
              key={edition.id}
              type="button"
              aria-pressed={selected}
              disabled={soldOut}
              onClick={() => onSelect(edition.id)}
              className={cn(
                'h-7 rounded-full border px-2.5 text-sm',
                selected ? 'border-primary font-medium text-text-accent' : 'border-control-border text-brand-secondary hover:border-primary',
                soldOut && 'cursor-not-allowed line-through opacity-60 hover:border-control-border',
              )}
            >
              {edition.label}
              {soldOut && <span className="sr-only"> ({t.detail.editionSoldOut})</span>}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
