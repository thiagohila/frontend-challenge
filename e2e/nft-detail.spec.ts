import { addToCart, expect, test } from './fixtures'

test.describe('T2 — NFT detail', () => {
  test('direct access renders the NFT, editions and the quantity limit', async ({ page }) => {
    await page.goto('/nft/emerald-ape-042')
    await expect(page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' })).toBeVisible()
    await expect(page).toHaveTitle('Emerald Ape #042 — Kurio')

    const soldOut = page.getByRole('button', { name: '1/1 (esgotada)' })
    await expect(soldOut).toBeDisabled()
    await page.getByRole('button', { name: '1/10', exact: true }).click()
    await expect(page).toHaveURL(/edition=ed-1-10/)

    // Only 3 units of 1/10 in stock: + disables at the limit (C5).
    // Desktop and mobile each render one visible stepper (the other is display:none, excluded by role queries).
    const stepper = page.getByRole('group', { name: 'Quantidade' })
    const increase = stepper.getByRole('button', { name: 'Aumentar quantidade' })
    await increase.click()
    await increase.click()
    await expect(stepper.locator('output')).toHaveText('3')
    await expect(increase).toBeDisabled()
    await expect(page.getByText('Limite de 3 por pedido nesta edição.')).toBeVisible()
  })

  test('the quantity limit counts what is already in the cart (K1)', async ({ page, isMobile }) => {
    const buy = page.getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true })
    const stepper = page.getByRole('group', { name: 'Quantidade' })
    await page.goto('/')
    await addToCart(page, [['emerald-ape-042', 'ed-1-10', 2]]) // 3 in stock
    await page.goto('/nft/emerald-ape-042?edition=ed-1-10')
    await expect(page.getByText('Limite de 3 por pedido nesta edição; 2 já no seu carrinho.')).toBeVisible()
    await expect(stepper.getByRole('button', { name: 'Aumentar quantidade' })).toBeDisabled()
    await expect(buy).toBeEnabled()

    await buy.click()
    await expect(page).toHaveURL('/cart')
    await page.goto('/nft/emerald-ape-042?edition=ed-1-10')
    await expect(page.getByTestId('cart-limit')).toHaveText('Você já tem o limite desta edição no carrinho (3).')
    await expect(buy).toBeDisabled()
  })

  test('a sold-out edition from the URL is explained', async ({ page }) => {
    await page.goto('/nft/emerald-ape-042?edition=ed-1-1')
    await expect(page.getByRole('alert').filter({ hasText: 'Esta edição está esgotada' })).toBeVisible()
  })

  test('unknown NFT shows the not-found page', async ({ page }) => {
    await page.goto('/nft/nao-existe-999')
    await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible()
    await page.getByRole('link', { name: 'Voltar ao catálogo' }).click()
    await expect(page).toHaveURL(/#mercado/)
  })
})
