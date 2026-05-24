import { test } from '@playwright/test'
import percySnapshot from '@percy/playwright'

test('home — full page', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
  await percySnapshot(page, 'Home — full page')
})
