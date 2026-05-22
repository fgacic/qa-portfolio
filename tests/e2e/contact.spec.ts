import { test, expect } from '@playwright/test'

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded()
  })

  test('shows all three fields and submit button', async ({ page }) => {
    const section = page.locator('#contact')
    await expect(section.locator('input[name="name"]')).toBeVisible()
    await expect(section.locator('input[name="email"]')).toBeVisible()
    await expect(section.locator('textarea[name="message"]')).toBeVisible()
    await expect(section.locator('button[type="submit"]')).toBeVisible()
  })

  test('shows name error on empty submit', async ({ page }) => {
    await page.locator('#contact button[type="submit"]').click()
    await expect(page.locator('#contact')).toContainText('required', { ignoreCase: true })
  })

  test('shows email error for invalid format', async ({ page }) => {
    await page.locator('#contact input[name="name"]').fill('Test User')
    await page.locator('#contact input[name="email"]').fill('notanemail')
    await page.locator('#contact textarea[name="message"]').fill('A message that is long enough to pass validation.')
    await page.locator('#contact button[type="submit"]').click()
    await expect(page.locator('#contact')).toContainText('valid email', { ignoreCase: true })
  })

  test('shows character counter on message field', async ({ page }) => {
    await expect(page.locator('#contact')).toContainText('/ 2000')
    await page.locator('#contact textarea[name="message"]').fill('hello')
    await expect(page.locator('#contact')).toContainText('5 / 2000')
  })

  test('shows success message after valid submission', async ({ page }) => {
    await page.locator('#contact input[name="name"]').fill('Test User')
    await page.locator('#contact input[name="email"]').fill('test@example.com')
    await page.locator('#contact textarea[name="message"]').fill('This is a test message that is long enough.')
    await page.locator('#contact button[type="submit"]').click()
    await expect(page.locator('#contact')).toContainText("I'll get back to you", { timeout: 5000 })
  })
})
