import type { CouponRecord } from '../db'

export function couponStatus(coupon: CouponRecord, now: number, forceExpired = false): 'valid' | 'expired' | 'invalid' {
  if (forceExpired || Date.parse(coupon.expiresAt) <= now) return 'expired'
  return 'valid'
}
