import { test, expect } from '@playwright/test'

test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders with name and role', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Filip Gačić')
    await expect(page.locator('#hero')).toContainText('QA Engineer')
  })

  test('page has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Filip Gačić/)
  })

  test('scroll cue link points to about section', async ({ page }) => {
    const cue = page.getByRole('link', { name: /scroll/i })
    await expect(cue).toHaveAttribute('href', '#about')
  })

  test('loads without JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })

  test('hero is keyboard accessible', async ({ page }) => {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })
})
