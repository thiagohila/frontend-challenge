import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

// The panel is hidden in automated runs unless a test opts in (src/mocks/browser.ts).
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('mock:panel', '1'))
})

const panel = (page: Page) => page.getByRole('complementary', { name: 'Servidor simulado (admin)' })

test.describe('X5 — "Servidor simulado (admin)" panel', () => {
  test('a price change made in the panel reaches the open page through Socket.IO (no reload), then reset restores the seed', async ({
    page,
    mock,
  }) => {
    await page.goto('/nft/emerald-ape-042')
    await expect.poll(() => mock.socketConnections()).toBeGreaterThan(0)
    await page.getByRole('button', { name: 'Servidor simulado (admin)' }).click()
    await expect(panel(page)).toBeVisible()
    await panel(page).getByLabel('NFT', { exact: true }).selectOption('emerald-ape-042')
    await panel(page).getByLabel('Preço (ETH)').fill('7.77')
    await panel(page).getByRole('button', { name: 'Alterar preço' }).click()
    await expect(page.getByTestId('mock-panel-status')).toHaveText('Feito: Alterar preço.')
    await expect(page.getByText('7.77 ETH').filter({ visible: true }).first()).toBeVisible()
    await expect(page.getByTestId('live-region')).toContainText('O preço ou a disponibilidade deste NFT foi atualizado.')

    await panel(page).getByRole('button', { name: 'Restaurar cenário' }).click()
    await expect(page.getByTestId('mock-panel-status')).toHaveText('Feito: Restaurar cenário.')
    await page.reload()
    await expect(page.getByText('1.19 ETH').filter({ visible: true }).first()).toBeVisible()
  })

  test('scenario switch from the panel restores that seed (empty catalog)', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Servidor simulado (admin)' }).click()
    await panel(page).getByLabel('Cenário', { exact: true }).selectOption('empty')
    await panel(page).getByRole('button', { name: 'Aplicar cenário' }).click()
    await expect(page.getByTestId('mock-panel-status')).toHaveText('Feito: Aplicar cenário.')
    await page.reload()
    await expect(page.getByText('Nenhum NFT encontrado com esses filtros.')).toBeVisible()
  })

  test('keyboard and a11y: Esc closes and returns focus to the tab; no serious axe violations', async ({ page }) => {
    await page.goto('/')
    const tab = page.getByRole('button', { name: 'Servidor simulado (admin)' })
    await tab.click()
    await expect(panel(page)).toBeVisible()
    const { violations } = await new AxeBuilder({ page }).include('#mock-panel-root').withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical').map((v) => v.id)).toEqual([])
    await page.keyboard.press('Escape')
    await expect(panel(page)).toHaveCount(0)
    await expect(tab).toBeFocused()
  })
})
