import { expect, test } from './fixtures'

test.describe('T8 — wallets', () => {
  test('adds a secondary wallet with validation, persists after reload', async ({ page, loginAs }) => {
    await page.goto('/account/wallets')
    await loginAs('bruno')
    const secondary = page.getByRole('region', { name: 'Carteira secundária' })
    await secondary.getByRole('button', { name: 'Adicionar' }).click()

    await secondary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(secondary.getByRole('alert').filter({ hasText: 'Selecione uma rede' })).toBeVisible()
    await expect(secondary.getByRole('alert').filter({ hasText: 'Endereço 0x inválido (40 caracteres hex)' })).toBeVisible()

    await secondary.getByRole('textbox', { name: 'Nome de exibição' }).fill('Bruno Lima')
    await secondary.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Cofre frio')
    await secondary.getByRole('combobox', { name: 'Rede' }).click()
    await page.getByRole('option', { name: 'Polygon' }).click()
    await secondary.getByRole('textbox', { name: 'Nome do perfil' }).fill('bruno.nft')
    await secondary.getByRole('textbox', { name: 'Endereço da carteira' }).fill('0x1234')
    await secondary.getByRole('combobox', { name: 'Tipo de carteira' }).click()
    await page.getByRole('option', { name: 'Coinbase Wallet' }).click()
    await secondary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(secondary.getByRole('textbox', { name: 'Endereço da carteira' })).toHaveAttribute('aria-invalid', 'true')

    await secondary.getByRole('textbox', { name: 'Endereço da carteira' }).fill('0xC0ffee254729296a45a3885639AC7E10F9d54979')
    await secondary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(page.getByTestId('wallet-secondary')).toContainText('Cofre frio')

    await page.reload()
    await expect(page.getByTestId('wallet-secondary')).toContainText('Polygon')
  })

  test('restricted account gets the API permission error (403)', async ({ page, loginAs }) => {
    await page.goto('/account/wallets')
    await loginAs('carol')
    const primary = page.getByRole('region', { name: 'Carteira principal' })
    await primary.getByRole('button', { name: 'Adicionar' }).click()
    await primary.getByRole('textbox', { name: 'Nome de exibição' }).fill('Carol Reis')
    await primary.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Minha')
    await primary.getByRole('combobox', { name: 'Rede' }).click()
    await page.getByRole('option', { name: 'Ethereum' }).click()
    await primary.getByRole('textbox', { name: 'Nome do perfil' }).fill('carol.restrita')
    await primary.getByRole('textbox', { name: 'Endereço da carteira' }).fill('0xC0ffee254729296a45a3885639AC7E10F9d54979')
    await primary.getByRole('combobox', { name: 'Tipo de carteira' }).click()
    await page.getByRole('option', { name: 'MetaMask' }).click()
    await primary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(primary.getByRole('alert')).toContainText('não tem permissão')
  })
})
