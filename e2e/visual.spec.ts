import type { Page } from '@playwright/test'
import { addToCart, expect, test } from './fixtures'

// Baselines are rendered on Linux (Docker, official Playwright image) so they are reproducible on any
// machine; font rendering differs on macOS, so the suite skips there (ARCHITECTURE §12, ADR 11).
test.skip(process.platform !== 'linux', 'visual baselines are Linux-only — run `npm run test:visual:docker`')

test.describe.configure({ timeout: 90_000 }) // Docker on macOS is slow; full-page shots of long pages

/** Deterministic page: data loaded, fonts ready, every (lazy) image decoded so the height is stable. */
async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
  await page.evaluate(async () => {
    await document.fonts.ready
    const images = [...document.images]
    for (const image of images) image.loading = 'eager'
    await Promise.all(
      images.map((image) =>
        image.complete
          ? image.decode().catch(() => undefined)
          : new Promise((resolve) => image.addEventListener('load', resolve, { once: true })),
      ),
    )
  })
  await page.waitForLoadState('networkidle')
}

const shot = (page: Page, name: string) =>
  expect(page).toHaveScreenshot(name, {
    fullPage: true,
    timeout: 20_000,
    // The commit stamp changes on every build.
    mask: [page.getByTestId('app-version')],
  })

test.describe('VIS — Figma screens with stable mock data', () => {
  test('home', async ({ page }) => {
    await page.goto('/')
    await settle(page)
    await shot(page, 'home.png')
  })

  test('nft detail', async ({ page }) => {
    await page.goto('/nft/emerald-ape-042')
    await settle(page)
    await shot(page, 'detail.png')
  })

  test('cart', async ({ page }) => {
    await page.goto('/cart')
    await addToCart(page, [
      ['emerald-ape-042', 'ed-1-50', 2],
      ['violet-nomad-314', 'ed-1-50', 1],
    ])
    await page.reload()
    await expect(page.getByTestId('cart-total')).toBeVisible()
    await settle(page)
    await shot(page, 'cart.png')
  })

  test('checkout', async ({ page, loginAs }) => {
    await page.goto('/')
    await loginAs('ana')
    await addToCart(page, [['emerald-ape-042', 'ed-1-50', 2]])
    await page.goto('/checkout')
    await expect(page.getByTestId('checkout-total')).toBeVisible()
    await settle(page)
    await shot(page, 'checkout.png')
  })
})
