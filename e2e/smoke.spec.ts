import { expect, test } from '@playwright/test'

test('app boots with MSW REST and Socket.IO mocks', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'NFT Marketplace' })).toBeVisible()
  await expect(page.getByTestId('api-status')).toHaveText('API: ok')
  await expect(page.getByTestId('socket-status')).toHaveText('Realtime: ok')
})

test('unknown route renders not found', async ({ page }) => {
  await page.goto('/rota-inexistente')
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
})
