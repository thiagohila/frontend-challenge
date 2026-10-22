import type { Page } from '@playwright/test'
import { DEMO_USERS } from '../src/mocks/server/seed'
import { addToCart, expect, test } from './fixtures'

// Deterministic mock scenarios (README "Cenários") that the flow specs don't already exercise (M5).

const catalog = (page: Page) => page.getByRole('list', { name: /NFTs? encontrados?/ })

test.describe('server-error: 503 on every route', () => {
  test.use({ scenario: 'server-error' })
  test('the catalog shows the error with retry, and recovers once the server is back', async ({ page, mock }) => {
    await page.goto('/')
    const failure = page.getByRole('alert').filter({ hasText: 'Não foi possível carregar o catálogo.' })
    await expect(failure).toBeVisible({ timeout: 15_000 }) // after the transient retries (max 2)
    await expect(catalog(page)).toHaveCount(0)

    await mock.reset('default')
    await failure.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(catalog(page)).toBeVisible()
  })
})

test.describe('register-conflict: sign-up always conflicts (409)', () => {
  test.use({ scenario: 'register-conflict' })
  test('the conflict is mapped to the username field and no account is created', async ({ page, mock }) => {
    await page.goto('/register')
    const form = page.getByRole('dialog')
    await form.getByRole('textbox', { name: 'Nome de usuário' }).fill('ninguem.usa.isso')
    await form.getByRole('textbox', { name: 'E-mail' }).fill('livre@kurio.test')
    await form.getByLabel('Senha', { exact: true }).fill('Senha1234')
    await form.getByLabel('Confirmar senha').fill('Senha1234')
    await form.getByRole('button', { name: /Criar (conta|perfil)/ }).click()

    await expect(form.getByRole('textbox', { name: 'Nome de usuário' })).toHaveAccessibleDescription(/Nome de usuário já está em uso/)
    await expect(form.getByRole('textbox', { name: 'Nome de usuário' })).toHaveAttribute('aria-invalid', 'true')
    const users = ((await mock.snapshot()) as { users: { email: string }[] }).users
    expect(users.some((user) => user.email === 'livre@kurio.test')).toBe(false)
  })
})

test.describe('session-expired: sessions last 20 s', () => {
  test.use({ scenario: 'session-expired' })
  test('after the TTL the next private call re-authenticates in place (A4)', async ({ page }) => {
    await page.clock.install()
    await page.goto('/login?redirect=/account/wallets')
    const form = page.getByRole('dialog')
    await form.getByRole('textbox', { name: 'E-mail' }).fill(DEMO_USERS.ana.email)
    await form.getByLabel('Senha', { exact: true }).fill('Kurio2026!')
    await form.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page).toHaveURL('/account/wallets')
    await expect(page.getByTestId('wallet-primary')).toBeVisible()

    await page.clock.fastForward('00:25') // past the 20 s TTL, on the clock the mock server reads too
    await page.getByRole('button', { name: 'Editar' }).first().click()
    await page.getByRole('textbox', { name: 'Apelido da carteira' }).fill('Depois do TTL')
    await page.getByRole('button', { name: 'Salvar carteira' }).click()
    const reauth = page.getByRole('dialog', { name: 'Sua sessão expirou' })
    await expect(reauth).toBeVisible()
    await reauth.getByLabel('Senha', { exact: true }).fill('Kurio2026!')
    await reauth.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(reauth).toBeHidden()
    await expect(page.getByRole('textbox', { name: 'Apelido da carteira' })).toHaveValue('Depois do TTL') // context kept
  })
})

test.describe('wallet-disconnect: the wallet drops 5 s after connecting', () => {
  test.use({ scenario: 'wallet-disconnect' })
  test('checkout learns it through Socket.IO, announces it and asks to reconnect (P3)', async ({ page, loginAs, mock }) => {
    await page.goto('/')
    await loginAs('ana')
    await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
    await page.goto('/checkout')
    await expect(page.getByTestId('checkout-total')).toHaveText('1.206 ETH')
    await expect.poll(() => mock.socketConnections()).toBeGreaterThan(0)
    await page.getByRole('button', { name: 'Conectar carteira' }).click()
    await expect(page.getByTestId('wallet-status')).toContainText('MetaMask conectada')

    await expect(page.getByTestId('wallet-status')).toBeHidden({ timeout: 10_000 })
    await expect(page.getByTestId('live-region')).toContainText('Sua carteira foi desconectada.')
    await expect(page.getByRole('button', { name: 'Conectar carteira' })).toBeVisible()
    const orders = ((await mock.snapshot()) as { orders: unknown[] }).orders
    expect(orders).toHaveLength(0)
  })
})

test.describe('unauthorized: 403 on private routes', () => {
  test.use({ scenario: 'unauthorized' })
  test("private screens show an error state, never another account's data or a fake success", async ({ page, loginAs }) => {
    await page.goto('/')
    await loginAs('ana')
    for (const path of ['/favorites', '/account/profile', '/account/wallets'] as const) {
      await page.goto(path)
      await expect(page.getByRole('alert').first(), path).toBeVisible({ timeout: 10_000 })
    }
    await expect(page.getByTestId('wallet-primary')).toHaveCount(0)
  })
})
