import { expect, test } from '@playwright/test'
import type { RealtimeEvent } from '../../src/contracts/events'
import { createEventGate } from '../../src/lib/realtime/gate'

const nftEvent = (eventId: string, version: number): RealtimeEvent => ({
  eventId,
  type: 'nft.updated',
  resourceId: 'emerald-ape-042',
  version,
  occurredAt: '2026-10-21T12:00:00.000Z',
  payload: { priceEth: '1.29', soldOut: false, editions: [] },
})

const orderEvent = (userId: string): RealtimeEvent => ({
  eventId: `evt-${userId}`,
  type: 'order.updated',
  resourceId: 'ord_1',
  version: 2,
  occurredAt: '2026-10-21T12:00:00.000Z',
  userId,
  payload: { status: 'confirmed', txHash: '0xabc', declineReason: null },
})

test.describe('realtime event gate (RT3, RT5)', () => {
  test('drops duplicates and stale versions, keeps newer ones', () => {
    const gate = createEventGate()
    expect(gate.accept(nftEvent('a', 2), null)).toBe(true)
    expect(gate.accept(nftEvent('a', 2), null)).toBe(false) // duplicate
    expect(gate.accept(nftEvent('b', 1), null)).toBe(false) // older version
    expect(gate.accept(nftEvent('c', 2), null)).toBe(false) // same version, different id
    expect(gate.accept(nftEvent('d', 3), null)).toBe(true)
  })

  test("never applies another user's private event", () => {
    const gate = createEventGate()
    expect(gate.accept(orderEvent('usr_bruno'), 'usr_ana')).toBe(false)
    expect(gate.accept(orderEvent('usr_ana'), null)).toBe(false) // signed out
    expect(gate.accept(orderEvent('usr_ana'), 'usr_ana')).toBe(true)
  })

  test('reset forgets the previous session', () => {
    const gate = createEventGate()
    gate.accept(nftEvent('a', 5), null)
    gate.reset()
    expect(gate.accept(nftEvent('a', 1), null)).toBe(true)
  })
})
