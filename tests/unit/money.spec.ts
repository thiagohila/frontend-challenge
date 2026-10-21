import { expect, test } from '@playwright/test'
import { formatEth, money } from '../../src/lib/money'

test.describe('money (ETH decimal strings)', () => {
  test('adds without floating point drift', () => {
    expect(money.add('0.1', '0.2')).toBe('0.3')
    expect(money.add('26.83', '0.016')).toBe('26.846')
  })

  test('multiplies by integer quantities only', () => {
    expect(money.times('1.19', 2)).toBe('2.38')
    expect(money.times('1.79', 9)).toBe('16.11')
    expect(() => money.times('1.19', 1.5)).toThrow()
  })

  test('keeps 18 decimals of precision', () => {
    expect(money.add('0.000000000000000001', '0.000000000000000002')).toBe('0.000000000000000003')
  })

  test('percent rounds down and subtraction never goes negative', () => {
    expect(money.percent('26.83', 10)).toBe('2.683')
    expect(money.percent('0.0000001', 10)).toBe('0')
    expect(money.sub('1', '2')).toBe('0')
  })

  test('formats with at least two decimals', () => {
    expect(formatEth('1.19')).toBe('1.19 ETH')
    expect(formatEth('2')).toBe('2.00 ETH')
    expect(formatEth('26.8460')).toBe('26.846 ETH')
    expect(money.compare('1.10', '1.1')).toBe(0)
  })
})
