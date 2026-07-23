import { test, expect } from '@playwright/test'
import percySnapshot from '@percy/playwright'
import { testIds } from '@/lib/testids'

test('home  -  full page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByTestId(testIds.sections.contact).scrollIntoViewIfNeeded()
  await expect(page.getByTestId(testIds.sections.contact)).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await percySnapshot(page, 'Home  -  full page')
})
