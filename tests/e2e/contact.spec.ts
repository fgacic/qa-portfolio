import { test, expect } from '@playwright/test'
import { testIds } from '@/lib/testids'

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId(testIds.sections.contact).scrollIntoViewIfNeeded()
  })

  test('shows all three fields and submit button', async ({ page }) => {
    await expect(page.getByTestId(testIds.contact.nameInput)).toBeVisible()
    await expect(page.getByTestId(testIds.contact.emailInput)).toBeVisible()
    await expect(page.getByTestId(testIds.contact.messageInput)).toBeVisible()
    await expect(page.getByTestId(testIds.contact.submit)).toBeVisible()
  })

  test('shows name error on empty submit', async ({ page }) => {
    await page.getByTestId(testIds.contact.submit).click()
    await expect(page.getByTestId(testIds.contact.nameError)).toContainText('required', { ignoreCase: true })
  })

  test('shows email error for invalid format', async ({ page }) => {
    await page.getByTestId(testIds.contact.nameInput).fill('Test User')
    await page.getByTestId(testIds.contact.emailInput).fill('notanemail')
    await page.getByTestId(testIds.contact.messageInput).fill('A message that is long enough to pass validation.')
    await page.getByTestId(testIds.contact.submit).click()
    await expect(page.getByTestId(testIds.contact.emailError)).toContainText('valid email', { ignoreCase: true })
  })

  test('shows character counter on message field', async ({ page }) => {
    await expect(page.getByTestId(testIds.contact.charCount)).toContainText('/ 500')
    await page.getByTestId(testIds.contact.messageInput).fill('hello')
    await expect(page.getByTestId(testIds.contact.charCount)).toContainText('5 / 500')
  })

  test('shows success message after valid submission', async ({ page }) => {
    await page.getByTestId(testIds.contact.nameInput).fill('Test User')
    await page.getByTestId(testIds.contact.emailInput).fill('test@example.com')
    await page.getByTestId(testIds.contact.messageInput).fill('This is a test message that is long enough.')
    await page.getByTestId(testIds.contact.submit).click()
    await expect(page.getByTestId(testIds.contact.toast)).toContainText("I'll get back to you", { timeout: 5000 })
  })
})
