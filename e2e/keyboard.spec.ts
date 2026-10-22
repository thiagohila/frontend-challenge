import type { Page } from '@playwright/test'
import { addToCart, expect, test } from './fixtures'

const focused = (page: Page) => page.locator(':focus')

test.describe('T11 — keyboard navigation, dialog focus and form validation', () => {
  test('skip link jumps to the main content', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible() // app rendered
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Pular para o conteúdo' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible() // visible when focused
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#conteudo$/)
  })

  test('opening a NFT with Enter moves focus to its heading', async ({ page }) => {
    await page.goto('/')
    const title = page.getByRole('link', { name: 'Emerald Ape #042' }).first()
    await title.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/nft/emerald-ape-042')
    await expect(page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' })).toBeFocused()
  })

  test('desktop: card actions appear on keyboard focus', async ({ page, isMobile }) => {
    test.skip(isMobile, 'hover actions are desktop-only (mobile shows the favorite button)')
    await page.goto('/')
    const card = page.getByRole('article', { name: 'Emerald Ape #042' })
    await card.getByRole('link', { name: 'Emerald Ape #042', exact: true }).focus()
    const actions = card.getByRole('button', { name: /Favoritar: Emerald Ape #042/ })
    await expect(actions).toHaveCSS('opacity', '1')
  })

  test('auth dialog traps focus, closes with Escape and validation focuses the first invalid field', async ({ page }) => {
    await page.goto('/register')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab')
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    }
    await dialog.getByRole('button', { name: /Criar (conta|perfil)/ }).focus()
    await page.keyboard.press('Enter')
    await expect(dialog.getByRole('textbox', { name: 'Nome de usuário' })).toBeFocused()
    await expect(dialog.getByRole('textbox', { name: 'Nome de usuário' })).toHaveAttribute('aria-invalid', 'true')

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL('/')
  })

  test('mobile filters drawer: focus trap and focus returns to the trigger', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'the drawer exists below lg')
    await page.goto('/')
    const trigger = page.getByRole('button', { name: /Abrir filtros/ })
    await trigger.focus()
    await page.keyboard.press('Enter')
    const drawer = page.getByRole('dialog', { name: 'Filtros' })
    await expect(drawer).toBeVisible()
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      expect(await drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('checkout review dialog: Escape returns focus to "Confirmar compra"', async ({ page, loginAs }) => {
    await page.goto('/')
    await loginAs('ana')
    await addToCart(page, [['emerald-ape-042', 'ed-1-50', 1]])
    await page.goto('/checkout')
    await page.getByRole('button', { name: 'Conectar carteira' }).click()
    await expect(page.getByTestId('wallet-status')).toBeVisible()
    const confirm = page.getByRole('button', { name: 'Confirmar compra' })
    await confirm.focus()
    await page.keyboard.press('Enter')
    const review = page.getByRole('dialog', { name: 'Revise seu pedido' })
    await expect(review).toBeVisible()
    await expect(focused(page)).not.toHaveCount(0)
    expect(await review.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(review).toBeHidden()
    await expect(confirm).toBeFocused()
  })
})
