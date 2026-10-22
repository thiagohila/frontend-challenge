import { Star } from 'lucide-react'
import { t } from '@/i18n'
import { cn } from '@/lib/utils'

export function RatingStars({ average, count }: { average: number; count: number }) {
  return (
    <p className="flex items-center gap-2 text-sm">
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
