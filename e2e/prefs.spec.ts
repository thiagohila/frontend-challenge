import { addToCart, expect, test } from './fixtures'

test.describe('EX1 — language switch', () => {
  test('switches the whole shell to en-US, sets <html lang> and the title, and persists across reloads', async ({ page, isMobile }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
    await expect(page.getByRole('heading', { name: 'Catálogo de NFTs' })).toBeVisible()

    await page.getByLabel('Idioma').selectOption('en-US')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
    await expect(page.getByLabel('Language')).toBeFocused() // the shell remounted under the select
    await expect(page).toHaveTitle('Kurio — NFT Marketplace')
    await expect(page.getByRole('heading', { name: 'NFT catalog' })).toBeVisible()
    await expect(page.getByText(/\d+ NFTs? found/)).toBeVisible()
    // Labels that used to be captured at module scope (regression guard).
    if (isMobile) await expect(page.getByRole('navigation', { name: 'Navigation' }).getByRole('link', { name: 'Home' })).toBeVisible()
    else await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
    await expect(page.locator('body')).not.toContainText('Pular para o conteúdo')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
    await expect(page.getByRole('heading', { name: 'NFT catalog' })).toBeVisible()

    await page.getByLabel('Language').selectOption('pt-BR')
    await expect(page.getByRole('heading', { name: 'Catálogo de NFTs' })).toBeVisible()
    await expect(page).toHaveTitle('Kurio — Marketplace de NFTs')
  })

  test('no pt-BR UI copy left on the main screens in en-US (catches captures outside render)', async ({ page, loginAs }) => {
    await page.goto('/')
    await loginAs('ana')
    await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
    await page.getByLabel('Idioma').selectOption('en-US')
    // Labels the app owns; NFT descriptions and server messages are data, not UI copy.
    const ptCopy = /\b(Carrinho|Entrar|Carteiras?|Pagamento|Início|Favoritos|Tentar novamente|Perfil|Rede|Edição|Quantidade)\b/
    for (const path of ['/', '/nft/emerald-ape-042', '/cart', '/checkout', '/favorites', '/account/profile', '/account/wallets'] as const) {
      await page.goto(path)
      await expect(page.locator('main h1').first()).toBeVisible()
      await expect(page.locator('body'), path).not.toContainText(ptCopy)
    }
  })

  test('client validation messages follow the language (contract messages are translated at render)', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Idioma').selectOption('en-US')
    await page.getByRole('textbox', { name: 'Email' }).fill('not-an-email')
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect(page.getByText('Invalid email')).toBeVisible()
    await expect(page.getByText('Enter your password')).toBeVisible()
  })
})

test.describe('EX2 — time format', () => {
  test('the transaction time follows the chosen hour cycle, persisted', async ({ page, loginAs }) => {
    await page.goto('/')
    await loginAs('ana')
    await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
    await page.goto('/checkout')
    await page.getByRole('button', { name: 'Conectar carteira' }).click()
    await expect(page.getByTestId('wallet-status')).toBeVisible()
    await page.getByRole('button', { name: 'Confirmar compra' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Enviar pedido' }).click()
    await expect(page.getByTestId('order-confirmed')).toBeVisible({ timeout: 15_000 })
    await page.getByRole('link', { name: 'Ver no explorador (simulado)' }).click()

    const confirmedAt = page.locator('dt', { hasText: 'Confirmada em' }).locator('xpath=following-sibling::dd')
    await expect(confirmedAt).not.toContainText(/AM|PM/) // pt-BR default: 24h
    await page.getByLabel('Formato de hora').selectOption('h12')
    await expect(confirmedAt).toContainText(/AM|PM/i)
    await page.reload()
    await expect(confirmedAt).toContainText(/AM|PM/i)
    await page.getByLabel('Formato de hora').selectOption('h23')
    await expect(confirmedAt).not.toContainText(/AM|PM/i)
  })
})
