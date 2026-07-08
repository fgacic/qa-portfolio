import { test, expect } from '@playwright/test'
import { testIds } from '@/lib/testids'

test.describe('Page sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('all sections are present in the DOM', async ({ page }) => {
    for (const id of [testIds.sections.hero, testIds.sections.about, testIds.sections.skills, testIds.sections.testing]) {
      await expect(page.getByTestId(id)).toBeAttached()
    }
  })

  test('about section is visible on scroll', async ({ page }) => {
    await page.getByTestId(testIds.sections.about).scrollIntoViewIfNeeded()
    await expect(page.getByTestId(testIds.sections.about)).toBeInViewport()
  })

  test('skills section is visible on scroll', async ({ page }) => {
    await page.getByTestId(testIds.sections.skills).scrollIntoViewIfNeeded()
    await expect(page.getByTestId(testIds.sections.skills)).toBeInViewport()
  })

  test('testing section is visible on scroll', async ({ page }) => {
    await page.getByTestId(testIds.sections.testing).scrollIntoViewIfNeeded()
    await expect(page.getByTestId(testIds.sections.testing)).toBeInViewport()
  })

  test('hero scroll cue navigates to about', async ({ page }) => {
    await page.getByRole('link', { name: /scroll/i }).click()
    await page.waitForTimeout(600)
    await expect(page.getByTestId(testIds.sections.about)).toBeInViewport()
  })
})
