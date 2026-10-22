import { execSync } from 'node:child_process'
import { expect, test } from '@playwright/test'

/**
 * Smoke against the public deployment (REQUIREMENTS D2): the published version is the delivered commit,
 * deep links survive a refresh, and the mock server + realtime work in production.
 * Run with: DEPLOY_URL=https://kurio-gold.vercel.app npx playwright test e2e/deploy.spec.ts --project=desktop
 */
const DEPLOY_URL = process.env.DEPLOY_URL
test.skip(!DEPLOY_URL, 'set DEPLOY_URL to check the public deployment')

test('production serves the delivered commit with mocks and realtime working', async ({ page, request }) => {
  const head = execSync('git rev-parse --short HEAD').toString().trim()
  const version = (await (await request.get(`${DEPLOY_URL}/version.json`)).json()) as { commit: string }
  expect(version.commit).toBe(head)

  await page.goto(`${DEPLOY_URL}/nft/emerald-ape-042`) // deep link, direct access
  await expect(page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' })).toBeVisible()

  // Realtime through socket.io-client in production: a server-side change shows up without reload.
  await page.waitForFunction(() => Boolean(window.__mock))
  await expect.poll(() => page.evaluate(() => window.__mock?.socketConnections() ?? 0)).toBeGreaterThan(0)
  await page.evaluate(() => window.__mock?.updateNft('emerald-ape-042', { priceEth: '7.77' }))
  await expect(page.getByText('7.77 ETH').filter({ visible: true }).first()).toBeVisible()

  const headers = (await request.get(`${DEPLOY_URL}/`)).headers()
  expect(headers['content-security-policy']).toContain("default-src 'self'")
  expect(headers['x-frame-options']).toBe('DENY')
})
