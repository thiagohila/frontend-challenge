import { useLayoutEffect, useRef } from 'react'
import { QuantityStepper } from '@/components/nft/QuantityStepper'
import { Button } from '@/components/ui/button'
import type { Money } from '@/contracts/common'
import { t } from '@/i18n'
import { iconSrc } from '@/lib/assets'
import { formatEth } from '@/lib/money'

interface MobileBuyBarProps {
  quantity: number
  max: number
  onQuantityChange: (quantity: number) => void
  priceEth: Money
  disabled: boolean
  pending: boolean
  onBuy: () => void
  onAddToCart: () => void
}

/** Mobile buy bar (Figma): fixed at the bottom with quantity, price and the two CTAs. */
export function MobileBuyBar({ quantity, max, onQuantityChange, priceEth, disabled, pending, onBuy, onAddToCart }: MobileBuyBarProps) {
  const bar = useRef<HTMLDivElement>(null)
  // The footer reserves exactly this much at the bottom (no guessed padding, no dead space).
  useLayoutEffect(() => {
    const element = bar.current
    if (!element) return
    const root = document.documentElement
    const publish = () => root.style.setProperty('--bottom-bar-height', `${element.offsetHeight}px`)
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(element)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--bottom-bar-height')
    }
  }, [])
  return (
    // Figma 70396:… buy bar: rounded-t 40, pt 20 / pb 36. Its height is published so the page ends above it.
    <div
      ref={bar}
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-[40px] bg-card px-6 pt-5 pb-[max(2.25rem,env(safe-area-inset-bottom))] shadow-[0_0_10px_rgba(10,6,4,.45)] lg:hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span aria-hidden className="text-sm text-muted-foreground">
            {t.detail.quantityShort}
          </span>
          <QuantityStepper
            variant="pill-sm"
            value={quantity}
            max={max}
            onChange={onQuantityChange}
            label={t.detail.quantity}
            disabled={disabled}
          />
        </div>
        <p className="text-xl font-bold text-text-accent">{formatEth(priceEth)}</p>
      </div>
      <div className="mt-4 flex gap-3">
        <Button
          onClick={onBuy}
          disabled={disabled || pending}
          className="h-[60px] flex-1 rounded-full bg-[linear-gradient(105deg,#d28a4c_4%,rgba(210,138,76,.8)_122%)] text-base font-bold"
        >
          {pending ? t.detail.adding : t.detail.buyMobile}
        </Button>
        <Button
          variant="outline"
          onClick={onAddToCart}
          disabled={disabled || pending}
          aria-label={t.cart.addToCart}
          className="size-[60px] rounded-full border-border bg-surface-raised"
        >
          <img src={iconSrc('icon-shop-secondary')} alt="" width={20} height={20} />
        </Button>
      </div>
    </div>
  )
}
