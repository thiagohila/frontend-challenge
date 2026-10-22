import { Star } from 'lucide-react'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

export function RatingStars({ average, count, className }: { average: number; count: number; className?: string }) {
  return (
    <p className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="sr-only">{t.detail.ratingLabel(average)}</span>
      <span aria-hidden className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, star) => `star-${star}`).map((key, star) => (
          <Star
            key={key}
            aria-hidden
            className={cn(
              'size-[15px]',
              star < Math.round(average) ? 'fill-primary text-primary' : 'fill-brand-secondary text-brand-secondary',
            )}
          />
        ))}
      </span>
      {t.detail.reviews(count)}
    </p>
  )
}

/** Mobile summary (Figma): "★ 4.8 (19)" pill next to the title. */
export function RatingPill({ average, count, className }: { average: number; count: number; className?: string }) {
  return (
    <p className={cn('flex shrink-0 items-center gap-1 rounded-full border border-primary px-2 py-0.5 text-sm font-bold', className)}>
      <Star aria-hidden className="size-[15px] fill-primary text-primary" />
      <span aria-hidden>
        {average.toFixed(1)}
        <span className="font-normal text-muted-foreground">({count})</span>
      </span>
      <span className="sr-only">
        {t.detail.ratingLabel(average)}, {t.detail.reviews(count)}
      </span>
    </p>
  )
}
