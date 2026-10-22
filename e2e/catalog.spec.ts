import type { Page } from '@playwright/test'
import { money } from '../src/lib/money'
import { expect, test } from './fixtures'

const results = (page: Page) => page.getByRole('list', { name: /NFTs? encontrados?/ })
const cardTitles = (page: Page) => results(page).getByRole('heading', { level: 3 })
/** Waits until no fetch is in flight: every listing update shows the skeleton until the real result. */
const settled = async (page: Page) => {
  // The refetch may not have started yet when this runs: wait for the network to go idle first.
  await page.waitForLoadState('networkidle')
  await expect(page.getByTestId('catalog-skeleton')).toBeHidden()
}
const cardPrices = async (page: Page) => (await results(page).locator('article p').allInnerTexts()).map((text) => text.split(' ')[0] ?? '0')

/** Closes the mobile drawer and waits until it is gone: while open/closing, Radix aria-hides the page. */
async function closeFilters(page: Page, isMobile: boolean) {
  if (!isMobile) return
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Filtros' })).toBeHidden()
}

/** Sidebar on desktop, drawer on mobile — same filters (U5). */
async function filters(page: Page, isMobile: boolean) {
  if (isMobile) await page.getByRole('button', { name: /Abrir filtros/ }).click()
  return isMobile ? page.getByRole('dialog', { name: 'Filtros' }) : page.locator('#mercado')
}

test.describe('T1 — search, filters, sort, pagination and history', () => {
  test('combined filters live in the URL, reset pagination and survive refresh/history', async ({ page, isMobile }) => {
    await page.goto('/?page=2')
    await expect(results(page)).toBeVisible()
    await expect(page.getByRole('link', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')

    let panel = await filters(page, isMobile)
    await panel.getByRole('button', { name: /Arte digital/ }).click()
    await expect(page).toHaveURL(/collection=/)
    await expect(page).not.toHaveURL(/page=2/) // filter change → page 1 (C2)
    await closeFilters(page, isMobile)

    panel = await filters(page, isMobile)
    await panel.getByRole('button', { name: /Ethereum/ }).click()
    await expect(panel.getByRole('button', { name: /Arte digital/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(panel.getByRole('button', { name: /Ethereum/ })).toHaveAttribute('aria-pressed', 'true')
    await closeFilters(page, isMobile)
    await expect(page).toHaveURL(/network=/)
    await settled(page)
    const filtered = await cardTitles(page).allInnerTexts()

    await page.reload()
    await expect(cardTitles(page)).toHaveText(filtered)

    await page.goBack()
    await expect(page).not.toHaveURL(/network=/)
    await expect(page).toHaveURL(/collection=/)
    await page.goForward()
    await expect(page).toHaveURL(/network=/)
    await expect(cardTitles(page)).toHaveText(filtered)
  })

  test('sort and search reflect the API query', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Ordenar por:' }).click()
    await page.getByRole('option', { name: 'Menor preço' }).click()
    await expect(page).toHaveURL(/sort=price-asc/)
    await expect
      .poll(async () => {
        const prices = await cardPrices(page)
        return prices.length > 0 && prices.every((price, index) => index === 0 || money.compare(prices[index - 1] ?? '0', price) <= 0)
      })
      .toBe(true)

    await page.getByRole('searchbox', { name: 'Buscar NFTs' }).fill('Golden')
    await expect(page).toHaveURL(/q=Golden/)
    // Wait for the filtered page (previous results stay visible while fetching).
    await expect.poll(async () => (await cardTitles(page).allInnerTexts()).every((title) => title.includes('Golden'))).toBe(true)
  })

  test('empty result offers to clear filters', async ({ page }) => {
    await page.goto('/?q=inexistente-xyz')
    await expect(page.getByText('Nenhum NFT encontrado com esses filtros.')).toBeVisible()
    await page.getByRole('button', { name: 'Limpar filtros' }).click()
    await expect(page).toHaveURL('/')
    await expect(cardTitles(page)).toHaveCount(9)
  })

  test.describe('out-of-order responses (jitter)', () => {
    test.use({ scenario: 'jitter' })
    test('the latest filter always wins', async ({ page, isMobile }) => {
      await page.goto('/')
      await expect(results(page)).toBeVisible()
      const panel = await filters(page, isMobile)
      // Fire changes quickly: earlier (slower) responses must not overwrite the final state (I6).
      await panel.getByRole('button', { name: /Polygon/ }).click()
      await panel.getByRole('button', { name: /Polygon/ }).click()
      await panel.getByRole('button', { name: /Solana/ }).click()
      await closeFilters(page, isMobile)
      await expect(page).toHaveURL(/network=/)
      await expect(page.getByTestId('catalog-skeleton')).toBeHidden({ timeout: 10_000 })
      await expect(page).toHaveURL(/solana/)
      await expect(page).not.toHaveURL(/polygon/)
      // What is rendered is the answer to the final filter, not a late response to an earlier one.
      const expected = await page.evaluate(async () => {
        const response = await fetch('/api/nfts?network=solana&pageSize=9')
        return ((await response.json()) as { total: number }).total
      })
      await expect(page.getByRole('list', { name: `${expected} NFTs encontrados` })).toBeVisible()
    })
  })
})

test.describe('empty catalog scenario', () => {
  test.use({ scenario: 'empty' })
  test('renders the empty state', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Nenhum NFT encontrado com esses filtros.')).toBeVisible()
  })
})

test('"Mercado" scrolls to the catalog again when the URL already has #mercado', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the desktop header holds the "Mercado" link')
  // The section lands just below the sticky header (its scroll-margin), not merely somewhere in the viewport.
  const sectionTop = () => page.evaluate(() => document.getElementById('mercado')?.getBoundingClientRect().top ?? Number.NaN)
  const headerBottom = () => page.evaluate(() => document.querySelector('header')?.getBoundingClientRect().bottom ?? Number.NaN)
  const mercado = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Mercado' })
  await page.goto('/')
  await expect(page.getByRole('list', { name: /NFTs? encontrados?/ })).toBeVisible()

  await mercado.click()
  await expect(page).toHaveURL(/#mercado$/)
  await expect.poll(sectionTop).toBeLessThan(130)
  expect(await sectionTop()).toBeGreaterThanOrEqual(await headerBottom())

  // Scroll back up like a user (wheel), then the same link again: same URL, still has to scroll.
  await page.mouse.move(700, 400)
  for (let step = 0; step < 15; step += 1) await page.mouse.wheel(0, -400)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await mercado.click()
  await expect.poll(sectionTop).toBeLessThan(130)
  expect(await sectionTop()).toBeGreaterThanOrEqual(await headerBottom())
})

test('sticky header: the current section follows the scroll, with a single current item', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the desktop header holds the main navigation')
  const nav = page.getByRole('navigation', { name: 'Navegação principal' })
  const current = nav.locator('[aria-current="page"]')
  await page.goto('/')
  await expect(page.getByRole('list', { name: /NFTs? encontrados?/ })).toBeVisible()
  await expect(current).toHaveText('Início')

  await page.mouse.move(700, 500)
  for (let step = 0; step < 4; step += 1) await page.mouse.wheel(0, 400)
  await expect(current).toHaveText('Mercado')
  await expect(current).toHaveCount(1)
  await expect(page.locator('header')).toBeInViewport() // stays on top while scrolling

  await nav.getByRole('link', { name: 'Início' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await expect(current).toHaveText('Início')
})

test('the header search goes to the catalog and focuses "Explorar coleções", also from another page', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the desktop header holds the search link')
  const search = page.getByRole('searchbox', { name: 'Buscar NFTs' }).filter({ visible: true })
  await page.goto('/nft/emerald-ape-042')
  await page.getByRole('link', { name: 'Buscar NFTs' }).click()
  await expect(page).toHaveURL(/\/#mercado$/)
  await expect(search).toBeFocused()
  await page.keyboard.type('Golden')
  await expect(page).toHaveURL(/q=Golden/)
})

test('a URL with catalog search/filters lands on the market with the result (shared link, refresh)', async ({ page }) => {
  const sectionTop = () => page.evaluate(() => document.getElementById('mercado')?.getBoundingClientRect().top ?? Number.NaN)
  await page.goto('/?q=Golden&sort=price-asc')
  await expect(cardTitles(page).first()).toContainText('Golden')
  await expect.poll(sectionTop).toBeLessThan(130)
  await expect.poll(sectionTop).toBeGreaterThanOrEqual(0)

  await page.goto('/') // no catalog state: the page opens at the top
  await expect(results(page)).toBeVisible()
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
})
