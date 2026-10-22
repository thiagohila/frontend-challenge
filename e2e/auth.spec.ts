import type { Page } from '@playwright/test'
import { DEMO_PASSWORD, DEMO_USERS } from '../src/mocks/server/seed'
import { expect, test } from './fixtures'

const dialog = (page: Page) => page.getByRole('dialog')

async function signIn(page: Page, email: string, password = DEMO_PASSWORD) {
  await dialog(page).getByRole('textbox', { name: 'E-mail' }).fill(email)
  await dialog(page).getByLabel('Senha', { exact: true }).fill(password)
  await dialog(page).getByRole('button', { name: 'Entrar', exact: true }).click()
}

const signOutButton = (page: Page) => page.getByRole('navigation', { name: 'Meu perfil' }).getByRole('button', { name: 'Sair' })

test.describe('T3 — account and session', () => {
  test('sign-up validates fields, maps API conflicts, then creates the account', async ({ page }) => {
    await page.goto('/register')
    const form = dialog(page)
    await form.getByRole('button', { name: /Criar (conta|perfil)/ }).click()
    await expect(form.getByText('Mínimo de 3 caracteres')).toBeVisible()
    await expect(form.getByText('E-mail inválido')).toBeVisible()

    await form.getByRole('textbox', { name: 'Nome de usuário' }).fill('nova.colecionadora')
    await form.getByRole('textbox', { name: 'E-mail' }).fill(DEMO_USERS.ana.email)
    await form.getByLabel('Senha', { exact: true }).fill('Senha1234')
    await form.getByLabel('Confirmar senha').fill('Senha9999')
    await form.getByRole('button', { name: /Criar (conta|perfil)/ }).click()
    await expect(form.getByText('As senhas não coincidem')).toBeVisible()

    await form.getByLabel('Confirmar senha').fill('Senha1234')
    await form.getByRole('button', { name: /Criar (conta|perfil)/ }).click()
    await expect(form.getByText('E-mail já cadastrado')).toBeVisible()
    await expect(form.getByRole('textbox', { name: 'E-mail' })).toHaveAttribute('aria-invalid', 'true')

    await form.getByRole('textbox', { name: 'E-mail' }).fill('nova@kurio.test')
    await form.getByRole('button', { name: /Criar (conta|perfil)/ }).click()
    await expect(dialog(page)).toBeHidden()
    await expect(page).toHaveURL('/')
  })

  test('sign-in rejects bad credentials and returns to the protected page', async ({ page }) => {
    await page.goto('/account/wallets')
    await expect(page).toHaveURL(/\/login\?redirect=%2Faccount%2Fwallets/)
    await signIn(page, DEMO_USERS.ana.email, 'senhaErrada1')
    await expect(dialog(page).getByRole('alert')).toHaveText('E-mail ou senha incorretos.')

    await signIn(page, DEMO_USERS.ana.email)
    await expect(page).toHaveURL('/account/wallets')
    await expect(page.getByRole('heading', { name: 'Carteira principal' })).toBeVisible()

    // Session survives a refresh (A3)
    await page.reload()
    await expect(page.getByTestId('wallet-primary')).toContainText('Principal')
  })

  test('expired session re-authenticates in place, keeping the filled form (A4)', async ({ page, loginAs, mock }) => {
    await page.goto('/account/wallets')
    await loginAs('ana')
    await page.getByRole('button', { name: 'Editar' }).first().click()
    await page.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Cofre')

    await mock.expireSession()
    await page.getByRole('button', { name: 'Salvar carteira' }).click()

    const reauth = page.getByRole('dialog', { name: 'Sua sessão expirou' })
    await expect(reauth).toBeVisible()
    await reauth.getByLabel('Senha', { exact: true }).fill(DEMO_PASSWORD)
    await reauth.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(reauth).toBeHidden()
    await expect(page).toHaveURL('/account/wallets')
    await expect(page.getByRole('textbox', { name: 'Apelido da carteira' })).toHaveValue('Cofre')
  })

  test('sign-out clears private data and switching users never leaks the previous account (A5, X4)', async ({ page, loginAs }) => {
    await page.goto('/account/wallets')
    await loginAs('ana')
    await expect(page.getByTestId('wallet-secondary')).toContainText('Reserva')

    await signOutButton(page).click()
    await expect(page).toHaveURL('/')
    expect(await page.evaluate(() => sessionStorage.getItem('kurio:session'))).toBeNull()
    await page.goto('/account/wallets')
    await expect(page).toHaveURL(/\/login/)

    await signIn(page, DEMO_USERS.bruno.email)
    await expect(page).toHaveURL('/account/wallets')
    await expect(page.getByTestId('wallet-primary')).toContainText('WalletConnect')
    await expect(page.getByText('Você ainda não adicionou uma carteira secundária.')).toBeVisible()
    await expect(page.getByText('Reserva')).toHaveCount(0)
  })

  test('sign-out without a reload keeps the catalog and realtime alive; the next user in the same tab sees nothing private (A5)', async ({
    page,
    loginAs,
    mock,
  }) => {
    const catalog = page.getByRole('list', { name: /NFTs? encontrados?/ })
    await page.goto('/account/wallets')
    await loginAs('ana')
    await expect(page.getByTestId('wallet-primary')).toBeVisible()

    // Pure SPA from here on: no page.goto, so the in-memory cache and socket are what the user really has.
    await signOutButton(page).click()
    await expect(page).toHaveURL('/')
    await expect(catalog).toBeVisible()
    await expect.poll(() => mock.socketConnections()).toBe(1)

    await page.evaluate(() => {
      history.pushState({}, '', '/favorites')
      dispatchEvent(new PopStateEvent('popstate'))
    })
    await expect(page).toHaveURL(/\/login/)
    await signIn(page, DEMO_USERS.bruno.email)
    await expect(page).toHaveURL('/favorites')
    await expect(page.getByText('Você ainda não favoritou nenhum NFT.')).toBeVisible()
    await expect(page.getByText('Sage Nomad #009')).toHaveCount(0) // Ana's favorite
    await expect.poll(() => mock.socketConnections()).toBe(1)
  })
})
