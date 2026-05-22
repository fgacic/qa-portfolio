import { test, expect } from '@playwright/test'

test.describe('Page sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('all sections are present in the DOM', async ({ page }) => {
    for (const id of ['hero', 'about', 'skills', 'testing']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })

  test('about section is visible on scroll', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded()
    await expect(page.locator('#about')).toBeInViewport()
  })

  test('skills section is visible on scroll', async ({ page }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded()
    await expect(page.locator('#skills')).toBeInViewport()
  })

  test('testing section is visible on scroll', async ({ page }) => {
    await page.locator('#testing').scrollIntoViewIfNeeded()
    await expect(page.locator('#testing')).toBeInViewport()
  })

  test('CV download link is present', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded()
    const link = page.getByRole('link', { name: /download cv/i })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/cv.pdf')
  })

  test('hero scroll cue navigates to about', async ({ page }) => {
    await page.getByRole('link', { name: /scroll/i }).click()
    await page.waitForTimeout(600)
    await expect(page.locator('#about')).toBeInViewport()
  })
})
