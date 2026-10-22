import type { Page } from '@playwright/test'
import { DEMO_PASSWORD, DEMO_USERS } from '../src/mocks/server/seed'
import { expect, test } from './fixtures'

const favoriteButton = (page: Page, isMobile: boolean) =>
  isMobile ? page.getByRole('button', { name: /Favoritar: Emerald Ape #042|Remover dos favoritos: Emerald Ape #042/ }) : page.getByRole('button', { name: /^(Favoritar|Favoritado)$/ })

test.describe('T4 — favorites', () => {
  test('a visitor signs in and the favorite is applied afterwards (intent)', async ({ page, isMobile }) => {
    await page.goto('/nft/emerald-ape-042')
    await favoriteButton(page, isMobile).click()
    await expect(page).toHaveURL(/\/login\?.*intent=favorite%3Aemerald-ape-042/)
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('textbox', { name: 'E-mail' }).fill(DEMO_USERS.bruno.email)
    await dialog.getByLabel('Senha', { exact: true }).fill(DEMO_PASSWORD)
    await dialog.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page).toHaveURL('/nft/emerald-ape-042')
    await expect(favoriteButton(page, isMobile)).toHaveAttribute('aria-pressed', 'true')
    await page.reload()
    await expect(favoriteButton(page, isMobile)).toHaveAttribute('aria-pressed', 'true') // persisted (C6)
  })

  test('mutation failure rolls back the optimistic state, then a retry succeeds', async ({ page, loginAs, mock, isMobile }) => {
    await page.goto('/nft/emerald-ape-042')
    await loginAs('bruno')
    const button = favoriteButton(page, isMobile)
    await expect(button).toHaveAttribute('aria-pressed', 'false')

    await mock.setLatency(800)
    await mock.fail('/me/favorites/*', { status: 500 }, { times: 1 })
    await button.click()
    await expect(button).toHaveAttribute('aria-pressed', 'true') // optimistic
    await expect(page.getByText('Não foi possível atualizar seus favoritos. Tente novamente.').first()).toBeVisible()
    await expect(button).toHaveAttribute('aria-pressed', 'false') // rolled back

    await mock.setLatency(null)
    await button.click()
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('live-region')).toContainText('adicionado aos favoritos') // server confirmed
    await page.goto('/favorites')
    await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  })
})
