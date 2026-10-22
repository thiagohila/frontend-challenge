import { expect, test } from './fixtures'

test.describe('T12 — loading skeletons, failure feedback and retry', () => {
  test.describe('slow network', () => {
    test.use({ scenario: 'slow' })
    test('shows the shimmer skeleton, then the content; every listing update shows the skeleton again', async ({ page }) => {
      await page.goto('/')
      const skeleton = page.getByTestId('catalog-skeleton')
      await expect(skeleton).toBeVisible()
      await expect(skeleton).toHaveAttribute('aria-busy', 'true')
      await expect(page.getByRole('list', { name: /NFTs encontrados/ })).toBeVisible({ timeout: 15_000 })

      await page.getByRole('button', { name: 'Em alta', exact: true }).click()
      // No "updating" text and no stale cards: the skeleton (same footprint) until the new result.
      await expect(skeleton).toBeVisible()
      await expect(page.getByRole('list', { name: /NFTs encontrados/ })).toBeHidden()
      await expect(page.getByText('Atualizando resultados…', { exact: true }).filter({ visible: true })).toHaveCount(0)
      await expect(page.getByRole('list', { name: /NFTs encontrados/ })).toBeVisible({ timeout: 15_000 })
    })
  })

  test('shimmer animates normally and stops with reduced motion (U3)', async ({ browser }) => {
    for (const reducedMotion of ['no-preference', 'reduce'] as const) {
      const context = await browser.newContext({ reducedMotion })
      const page = await context.newPage()
      await page.addInitScript(() => {
        sessionStorage.setItem('mock:init', '1')
        sessionStorage.setItem('msw-server-runtime', JSON.stringify({ scenario: 'slow', latency: null, failures: [], consumedFlags: [] }))
      })
      await page.goto('/')
      const bone = page.getByTestId('catalog-skeleton').locator('[data-slot=skeleton]').first()
      await expect(bone).toBeVisible()
      const duration = await bone.evaluate((element) => getComputedStyle(element).animationDuration)
      if (reducedMotion === 'reduce') expect(Number.parseFloat(duration)).toBeLessThan(0.1)
      else expect(Number.parseFloat(duration)).toBeGreaterThan(1)
      await context.close()
    }
  })

  test('catalog failure shows an error and recovers on retry', async ({ page, mock }) => {
    await page.goto('/')
    await expect(page.getByRole('list', { name: /NFTs encontrados/ })).toBeVisible()
    // More failures than automatic retries, so the error surfaces (ARCHITECTURE §12).
    await mock.fail('/nfts', { status: 503 })
    await page.goto('/?tab=trending')
    await expect(page.getByRole('alert').filter({ hasText: 'Não foi possível carregar o catálogo.' })).toBeVisible({ timeout: 15_000 })
    await mock.clearFailures()
    await page.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(page.getByRole('list', { name: /NFTs encontrados/ })).toBeVisible()
  })
})
