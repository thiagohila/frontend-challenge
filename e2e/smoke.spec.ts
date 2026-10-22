import { expect, test } from './fixtures'

test('app boots: shell, catalog from the MSW API and the version stamp', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SEJA DONO')
  await expect(page.getByRole('list', { name: /NFTs encontrados/ })).toBeVisible()
  await expect(page.getByTestId('app-version')).toContainText('Versão')
})

test('unknown route renders not found', async ({ page }) => {
  await page.goto('/rota-inexistente')
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
})
