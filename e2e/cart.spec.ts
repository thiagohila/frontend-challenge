import type { Page } from '@playwright/test'
import { DEMO_PASSWORD, DEMO_USERS } from '../src/mocks/server/seed'
import { addToCart, expect, test } from './fixtures'

const summary = (page: Page) => page.getByTestId('cart-summary')
const line = (page: Page, nftId: string, isMobile: boolean) => page.getByTestId(isMobile ? `cart-card-${nftId}` : `cart-line-${nftId}`)

test.describe('T5 — cart', () => {
  test('buy from the detail, change quantities within stock, remove, totals from the API, persist after refresh', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/nft/emerald-ape-042')
    await page.getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true }).click()
    await expect(page).toHaveURL('/cart')
    await expect(line(page, 'emerald-ape-042', isMobile)).toBeVisible()
    await expect(summary(page)).toContainText('1.19 ETH')
    await expect(page.getByTestId('cart-total')).toHaveText('1.206 ETH') // 1.19 + 0.016 fee

    await line(page, 'emerald-ape-042', isMobile).getByRole('button', { name: 'Aumentar quantidade' }).click()
    await expect(page.getByTestId('cart-total')).toHaveText('2.396 ETH')

    await addToCart(page, [['ivory-baron-088', 'ed-1-50', 1]])
    await page.reload()
    await expect(line(page, 'ivory-baron-088', isMobile)).toBeVisible()
    await expect(page.getByTestId('cart-total')).toHaveText('4.186 ETH') // 2.38 + 1.79 + 0.016

    await line(page, 'ivory-baron-088', isMobile)
      .getByRole('button', { name: /Remover Ivory Baron/ })
      .click()
    await expect(line(page, 'ivory-baron-088', isMobile)).toBeHidden()
    await page.reload()
    await expect(page.getByTestId('cart-total')).toHaveText('2.396 ETH')
  })

  test('coupon: invalid, expired, valid, removal — and it survives a refresh', async ({ page }) => {
    await page.goto('/cart')
    await addToCart(page, [['emerald-ape-042', 'ed-1-50', 2]])
    await page.reload()
    const code = page.getByRole('textbox', { name: 'Código promocional' })
    const apply = page.getByRole('button', { name: 'Aplicar' })

    await code.fill('NAOEXISTE')
    await apply.click()
    await expect(code).toHaveAccessibleDescription(/Cupom inválido/)
    await code.fill('GENESIS20')
    await apply.click()
    await expect(code).toHaveAccessibleDescription(/Cupom expirado/)

    await code.fill('kurio10')
    await apply.click()
    await expect(page.locator('#conteudo').getByText('Cupom KURIO10 aplicado (10% de desconto).')).toBeVisible() // not the live region copy
    await expect(summary(page)).toContainText('(-) 0.238')
    await expect(page.getByTestId('cart-total')).toHaveText('2.158 ETH') // 2.38 - 0.238 + 0.016

    await page.reload()
    await expect(page.locator('#conteudo').getByText('Cupom KURIO10 aplicado (10% de desconto).')).toBeVisible() // not the live region copy
    await page.getByRole('button', { name: 'Remover cupom' }).click()
    await expect(page.getByTestId('cart-total')).toHaveText('2.396 ETH')
  })

  test("guest items are kept after signing in, clamped to the user's stock", async ({ page }) => {
    await page.goto('/cart')
    await addToCart(page, [['emerald-ape-042', 'ed-1-10', 3]])
    await page.reload()
    await page.goto('/checkout') // requires auth → login
    await expect(page).toHaveURL(/auth=login/)
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('textbox', { name: 'E-mail' }).fill(DEMO_USERS.bruno.email)
    await dialog.getByLabel('Senha', { exact: true }).fill(DEMO_PASSWORD)
    await dialog.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page).toHaveURL('/checkout')
    await page.goto('/cart')
    await expect(page.getByTestId('cart-total')).toHaveText('3.586 ETH') // 3 × 1.19 + 0.016, now in bruno's cart
  })
})

test.describe('empty cart entry point', () => {
  test('clicking the empty cart explains it next to the icon instead of navigating; the empty page stays for an emptied cart', async ({
    page,
    isMobile,
  }) => {
    const entry = isMobile
      ? page.getByRole('navigation', { name: 'Navegação' }).getByRole('button', { name: 'Carrinho' })
      : page.locator('header').getByRole('button', { name: 'Carrinho' })
    await page.goto('/')
    await expect(page.getByRole('list', { name: /NFTs? encontrados?/ })).toBeVisible()
    await entry.click()
    await expect(page.getByTestId('empty-cart-popover')).toContainText('Seu carrinho está vazio.')
    await expect(page).toHaveURL('/')
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('empty-cart-popover')).toBeHidden()
    await expect(entry).toBeFocused() // focus returns to the trigger

    // With items, the same entry is a link to /cart; removing everything there shows the empty page.
    await page.goto('/nft/emerald-ape-042')
    await page.getByRole('button', { name: isMobile ? 'Comprar NFT' : 'COMPRAR', exact: true }).click()
    await expect(page).toHaveURL('/cart')
    await page
      .getByTestId(isMobile ? 'cart-card-emerald-ape-042' : 'cart-line-emerald-ape-042')
      .getByRole('button', { name: /Remover Emerald Ape/ })
      .click()
    await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
  })

  test('the checkout CTA reads "Conectar e comprar" for a guest and "Comprar" once signed in', async ({ page, loginAs }) => {
    await page.goto('/cart')
    await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
    await page.reload()
    await expect(page.getByRole('link', { name: 'Conectar e comprar' })).toBeVisible()
    await loginAs('ana') // API sign-in (no guest merge, covered in T5): give Ana her own item
    await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
    await page.goto('/cart')
    await expect(page.getByRole('link', { name: 'Comprar', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Conectar e comprar' })).toHaveCount(0)
  })
})
