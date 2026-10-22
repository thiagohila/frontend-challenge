import Decimal from 'decimal.js'
import type { Money } from '@/contracts/common'

// Isolated Decimal constructor: ETH math never goes through JS floats (REQUIREMENTS K7).
const Eth = Decimal.clone({ precision: 40, rounding: Decimal.ROUND_HALF_UP })

const ETH_DECIMALS = 18

const toMoney = (value: Decimal): Money => value.toDecimalPlaces(ETH_DECIMALS).toFixed()

export const money = {
  zero: '0' as Money,
  add: (...values: Money[]): Money => toMoney(values.reduce((sum, value) => sum.plus(value), new Eth(0))),
  sub: (a: Money, b: Money): Money => toMoney(Decimal.max(new Eth(a).minus(b), 0)),
  times: (value: Money, quantity: number): Money => {
    if (!Number.isInteger(quantity)) throw new Error(`quantity must be an integer, got ${quantity}`)
    return toMoney(new Eth(value).times(quantity))
  },
  /** Percentage of a value, rounded down to 6 decimals (never over-discount). */
  percent: (value: Money, pct: number): Money => toMoney(new Eth(value).times(pct).dividedBy(100).toDecimalPlaces(6, Decimal.ROUND_DOWN)),
  compare: (a: Money, b: Money): -1 | 0 | 1 => new Eth(a).comparedTo(b) as -1 | 0 | 1,
  equals: (a: Money, b: Money) => new Eth(a).equals(b),
  /** Display: at least 2 decimals, trailing zeros trimmed beyond that ("1.19", "26.846"). */
  format: (value: Money): string => {
    const fixed = new Eth(value).toFixed()
    const [int, frac = ''] = fixed.split('.')
    const trimmed = frac.replace(/0+$/, '')
    return `${int}.${trimmed.padEnd(2, '0')}`
  },
}

export const formatEth = (value: Money) => `${money.format(value)} ETH`
