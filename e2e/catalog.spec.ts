import type { Page } from '@playwright/test'
import { money } from '../src/lib/money'
import { expect, test } from './fixtures'

const results = (page: Page) => page.getByRole('list', { name: /NFTs? encontrados?/ })
const cardTitles = (page: Page) => results(page).getByRole('heading', { level: 3 })
/** Waits until no background fetch is in flight (placeholder data replaced by the real result). */
const settled = (page: Page) => expect(page.getByTestId('catalog-updating')).toBeHidden()
const cardPrices = async (page: Page) => (await results(page).locator('article p').allInnerTexts()).map((text) => text.split(' ')[0] ?? '0')

/** Sidebar on desktop, drawer on mobile — same filters (U5). */
async function filters(page: Page, isMobile: boolean) {
  if (isMobile) await page.getByRole('button', { name: /Abrir filtros/ }).click()
  return isMobile ? page.getByRole('dialog', { name: 'Filtros' }) : page.locator('#catalogo')
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
    if (isMobile) await page.keyboard.press('Escape')

    panel = await filters(page, isMobile)
    await panel.getByRole('button', { name: /Ethereum/ }).click()
    await expect(panel.getByRole('button', { name: /Arte digital/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(panel.getByRole('button', { name: /Ethereum/ })).toHaveAttribute('aria-pressed', 'true')
    if (isMobile) await page.keyboard.press('Escape')
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
      if (isMobile) await page.keyboard.press('Escape')
      await expect(page).toHaveURL(/network=/)
      await expect(page.getByTestId('catalog-updating')).toBeHidden({ timeout: 10_000 })
      await expect(page).toHaveURL(/solana/)
      await expect(page).not.toHaveURL(/polygon/)
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
