import { type ComponentProps, useState } from 'react'
import { FormField } from '@/components/form/FormField'
import type { Coupon } from '@/contracts/cart'
import { applyCouponSchema } from '@/contracts/cart'
import { t } from '@/i18n'
import { announce } from '@/lib/announce'
import { applyApiErrors, useZodForm } from '@/lib/zod-form'
import { useCartMutations } from '../queries'

/** Apply/remove coupon; invalid and expired codes come back as field errors from the API (K4). */
export function CouponForm({ coupon }: { coupon: Coupon | null }) {
  const { applyCoupon, removeCoupon } = useCartMutations()
  const [formError, setFormError] = useState<string | null>(null)
  const form = useZodForm(applyCouponSchema, { defaultValues: { code: '' } })

  if (coupon) {
    return (
      <div className="flex items-center justify-between gap-3 rounded border border-primary px-3 py-2 text-sm">
        <span>{t.cart.couponApplied(coupon.code, coupon.percentOff)}</span>
        <button
          type="button"
          onClick={() => removeCoupon.mutate()}
          disabled={removeCoupon.isPending}
          className="font-bold text-text-accent underline-offset-4 hover:underline"
        >
          {t.cart.couponRemove}
        </button>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(({ code }) => {
        setFormError(null)
        applyCoupon.mutate(code, {
          onSuccess: (cart) => {
            form.reset()
            if (cart.coupon) announce(t.cart.couponApplied(cart.coupon.code, cart.coupon.percentOff))
          },
          onError: (error) => setFormError(applyApiErrors(error, form)),
        })
      })}
    >
      <FormField
        label={t.cart.couponLabel}
        hideLabel="mobile"
        error={form.formState.errors.code?.message ?? (formError && !form.formState.errors.code ? formError : undefined)}
      >
        {/* Typing a new code clears the API's answer for the previous one (field and form message alike). */}
        <CouponInput pending={applyCoupon.isPending} {...form.register('code', { onChange: () => setFormError(null) })} />
      </FormField>
    </form>
  )
}

// React 19: `ref` from register() arrives as a regular prop and is spread onto the <input>.
function CouponInput({ pending, ...props }: ComponentProps<'input'> & { pending: boolean }) {
  return (
    <div className="flex h-[50px] overflow-hidden rounded-full border border-primary shadow-[0_6px_10px_rgba(10,6,4,.45)] lg:h-10 lg:rounded-[3px] lg:shadow-none">
      <input
        {...props}
        autoComplete="off"
        placeholder={t.cart.couponPlaceholder}
        className="min-w-0 flex-1 bg-transparent px-4 text-xs placeholder:text-brand-secondary focus-visible:outline-none lg:px-2"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-[102px] rounded-full bg-primary text-base font-bold text-primary-foreground hover:bg-text-accent disabled:opacity-60 lg:rounded-none"
      >
        {t.cart.couponApply}
      </button>
    </div>
  )
}
