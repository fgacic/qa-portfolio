import { test, expect } from '@playwright/test'
import { testIds } from '@/lib/testids'

test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders with name and role', async ({ page }) => {
    await expect(page.getByTestId(testIds.hero.title)).toContainText('Filip Gačić')
    await expect(page.getByTestId(testIds.sections.hero)).toContainText('QA Engineer')
  })

  test('page has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Filip Gačić/)
  })

  // Accessibility assertion: the scroll cue must expose an accessible name and href.
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
    await page.waitForLoadState('load')
    expect(errors).toHaveLength(0)
  })

  test('hero is keyboard accessible', async ({ page }) => {
    await page.keyboard.press('Tab')
    await expect(page.getByTestId(testIds.hero.scrollCue)).toBeFocused()
  })
})
