import { DEMO_PASSWORD, DEMO_USERS } from '../src/mocks/server/seed'
import { expect, test } from './fixtures'

// 2×2 PNG (red) — a real image for the avatar pipeline (resize → WebP).
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==',
  'base64',
)

test.describe('T8 — wallets', () => {
  test('"Igual à carteira principal" sits on the secondary header: shown with a primary (or while filling one in) and copies it, alias excluded', async ({
    page,
    loginAs,
  }) => {
    await page.goto('/account/wallets')
    await loginAs('bruno') // primary only
    const secondary = page.getByRole('region', { name: 'Carteira secundária' })
    const same = secondary.getByRole('checkbox', { name: 'Igual à carteira principal' })
    await same.check()
    await expect(secondary.getByRole('textbox', { name: 'Nome de exibição' })).toHaveValue('Bruno Lima')
    await expect(secondary.getByRole('textbox', { name: 'Nome do perfil' })).toHaveValue('bruno.nft')
    await expect(secondary.getByRole('textbox', { name: 'Apelido da carteira' })).toHaveValue('') // names this wallet: not copied
    await same.uncheck()
    await expect(secondary.getByRole('textbox', { name: 'Nome de exibição' })).toHaveValue('')
    await secondary.getByRole('button', { name: 'Cancelar' }).click()
    await expect(secondary.getByRole('button', { name: 'Salvar carteira' })).toHaveCount(0)
  })

  test('edits the primary and the secondary wallet; both changes persist after reload', async ({ page, loginAs }) => {
    await page.goto('/account/wallets')
    await loginAs('ana')
    for (const [region, alias] of [
      ['Carteira principal', 'Principal editada'],
      ['Carteira secundária', 'Reserva editada'],
    ] as const) {
      const section = page.getByRole('region', { name: region })
      await section.getByRole('button', { name: 'Editar' }).click()
      await section.getByRole('textbox', { name: 'Apelido da carteira' }).fill(alias)
      await section.getByRole('button', { name: 'Salvar carteira' }).click()
      await expect(section).toContainText(alias)
    }
    await page.reload()
    await expect(page.getByTestId('wallet-primary')).toContainText('Principal editada')
    await expect(page.getByTestId('wallet-secondary')).toContainText('Reserva editada')
  })

  test('adds a secondary wallet with validation, persists after reload', async ({ page, loginAs }) => {
    await page.goto('/account/wallets')
    await loginAs('bruno')
    const secondary = page.getByRole('region', { name: 'Carteira secundária' })
    await secondary.getByRole('button', { name: 'Adicionar' }).click()

    await secondary.getByRole('button', { name: 'Salvar carteira' }).click()
    // Errors are exposed the way assistive tech reads them: the field's accessible description.
    await expect(secondary.getByRole('combobox', { name: 'Rede' })).toHaveAccessibleDescription(/Selecione uma rede/)
    await expect(secondary.getByRole('textbox', { name: 'Endereço da carteira' })).toHaveAccessibleDescription(/Endereço inválido/)

    await secondary.getByRole('textbox', { name: 'Nome de exibição' }).fill('Bruno Lima')
    await secondary.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Cofre frio')
    await secondary.getByRole('combobox', { name: 'Rede' }).click()
    await page.getByRole('option', { name: 'Polygon' }).click()
    await secondary.getByRole('textbox', { name: 'Nome do perfil' }).fill('bruno.nft')
    await secondary.getByRole('textbox', { name: 'Endereço da carteira' }).fill('0x1234')
    await secondary.getByRole('combobox', { name: 'Tipo de carteira' }).click()
    await page.getByRole('option', { name: 'Coinbase Wallet' }).click()
    await secondary.getByRole('textbox', { name: 'Código de indicação' }).fill('KURIO-BRUNO') // required (Figma "*")
    await secondary.getByRole('textbox', { name: 'Nome ENS' }).fill('bruno-cofre')
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
    await primary.getByRole('textbox', { name: 'Código de indicação' }).fill('KURIO-CAROL')
    await primary.getByRole('textbox', { name: 'Nome ENS' }).fill('carol')
    await primary.getByRole('button', { name: 'Salvar carteira' }).click()
    await expect(primary.getByRole('alert')).toContainText('não tem permissão')
  })
})

test.describe('T8 — profile, avatar and password', () => {
  test('edits data with API conflict errors, persists after reload and updates the header', async ({ page, loginAs, isMobile }) => {
    await page.goto('/account/profile')
    await loginAs('ana')
    const name = page.getByRole('textbox', { name: 'Nome de exibição' })
    await expect(name).toHaveValue('Ana Sato')

    await page.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Cofre') // required, empty in the seed
    await page.getByRole('textbox', { name: 'Nome de usuário' }).fill('bruno.nft') // taken by Bruno
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByRole('textbox', { name: 'Nome de usuário' })).toHaveAccessibleDescription(/já está em uso/)

    await page.getByRole('textbox', { name: 'Nome de usuário' }).fill('ana.sato')
    await name.fill('Ana S.')
    await page.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Cofre')
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByTestId('live-region')).toContainText('Perfil salvo.')
    await page.reload()
    await expect(name).toHaveValue('Ana S.')
    if (!isMobile) await expect(page.getByRole('banner').getByText('Ana S.')).toBeVisible()
  })

  test('avatar: rejects unsupported files, uploads (resized) and removes', async ({ page, loginAs }) => {
    await page.goto('/account/profile')
    await loginAs('ana')
    const input = page.getByTestId('avatar-input')
    await input.setInputFiles({ name: 'logo.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') })
    await expect(page.getByRole('alert').filter({ hasText: 'Formato não suportado' })).toBeVisible()

    await input.setInputFiles({ name: 'me.png', mimeType: 'image/png', buffer: PNG })
    await expect(page.getByTestId('avatar-image')).toHaveAttribute('src', /^data:image\/webp;base64,/)
    await page.reload()
    await expect(page.getByTestId('avatar-image')).toBeVisible()
    await page.getByRole('button', { name: 'Remover' }).click()
    await expect(page.getByTestId('avatar-placeholder')).toBeVisible()
  })

  test('password: validation, wrong current password, then a real change used to sign in', async ({ page, loginAs }) => {
    await page.goto('/account/profile')
    await loginAs('ana')
    await page.getByLabel('Nova senha', { exact: true }).fill('curta')
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByLabel('Senha atual')).toHaveAccessibleDescription(/Informe a senha atual/)
    await expect(page.getByLabel('Confirmar nova senha')).toHaveAccessibleDescription(/não coincidem/)

    await page.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Cofre') // required, empty in the seed
    await page.getByLabel('Senha atual').fill('errada123')
    await page.getByLabel('Nova senha', { exact: true }).fill('NovaSenha2026')
    await page.getByLabel('Confirmar nova senha').fill('NovaSenha2026')
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByLabel('Senha atual')).toHaveAccessibleDescription(/Senha atual incorreta/)

    await page.getByLabel('Senha atual').fill(DEMO_PASSWORD)
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByTestId('live-region')).toContainText('Perfil salvo.')

    // The new password works for a fresh sign-in.
    await page.getByRole('navigation', { name: 'Meu perfil' }).getByRole('button', { name: 'Sair' }).click()
    await page.goto('/login')
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('textbox', { name: 'E-mail' }).fill(DEMO_USERS.ana.email)
    await dialog.getByLabel('Senha', { exact: true }).fill('NovaSenha2026')
    await dialog.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(dialog).toBeHidden()
  })
})
