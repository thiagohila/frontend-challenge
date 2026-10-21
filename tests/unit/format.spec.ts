import { expect, test } from '@playwright/test'
import { formatDateTime } from '../../src/lib/format'

test('formats date-time per locale and hour cycle', () => {
  const iso = '2026-10-21T21:05:00Z'
  expect(formatDateTime(iso, { locale: 'en-US', hourCycle: 'h12' })).toMatch(/PM/)
  expect(formatDateTime(iso, { locale: 'pt-BR', hourCycle: 'h23' })).not.toMatch(/PM/)
})
