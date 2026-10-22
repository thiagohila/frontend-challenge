import type { Page } from '@playwright/test'
import { expect, test, waitForMockServer } from './fixtures'

// REST contracts served by the MSW handlers through the real service worker (M1, R1, R2).
interface ApiInit {
  method?: string
  headers?: Record<string, string>
  body?: string
}

async function api(page: Page, path: string, init: ApiInit = {}) {
  return page.evaluate(
    async ({ path: url, init: options }) => {
      const response = await fetch(`/api${url}`, options)
      const text = await response.text()
      return { status: response.status, body: text ? (JSON.parse(text) as Record<string, unknown>) : null }
    },
    { path, init },
  )
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await waitForMockServer(page)
})

test('catalog list reflects query params and unknown NFT is 404', async ({ page }) => {
  const list = await api(page, '/nfts?collection=arte-digital&network=ethereum&sort=price-asc&page=1')
  expect(list.status).toBe(200)
  expect(list.body).toMatchObject({ page: 1, pageSize: 9 })
  const missing = await api(page, '/nfts/does-not-exist')
  expect(missing).toMatchObject({ status: 404, body: { error: { code: 'NOT_FOUND' } } })
})

test('private routes need a session; data is scoped to the token owner', async ({ page, loginAs }) => {
  expect((await api(page, '/me/favorites')).status).toBe(401)
  await loginAs('ana')
  await waitForMockServer(page)
  const session = await page.evaluate(() => JSON.parse(sessionStorage.getItem('kurio:session') ?? '{}') as { token: string })
  const favorites = await api(page, '/me/favorites', { headers: { Authorization: `Bearer ${session.token}` } })
  expect(favorites.status).toBe(200)
  expect(favorites.body).toMatchObject({ items: [expect.anything(), expect.anything()] })
})

test('injected failures are one-shot and the mock state persists across reloads', async ({ page, mock }) => {
  await mock.fail('/nfts/featured', { status: 503 }, { times: 1 })
  expect((await api(page, '/nfts/featured')).status).toBe(503)
  expect((await api(page, '/nfts/featured')).status).toBe(200)

  await mock.updateNft('emerald-ape-042', { priceEth: '2.50' })
  await page.reload()
  await waitForMockServer(page)
  expect((await api(page, '/nfts/emerald-ape-042')).body).toMatchObject({ priceEth: '2.50', version: 2 })
})

test.describe('offline scenario', () => {
  test.use({ scenario: 'offline' })
  test('every request fails at the network layer', async ({ page }) => {
    const result = await page.evaluate(() =>
      fetch('/api/nfts').then(
        () => 'ok',
        () => 'network-error',
      ),
    )
    expect(result).toBe('network-error')
  })
})
