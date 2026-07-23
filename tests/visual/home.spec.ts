import { test, type Page } from '@playwright/test'
import percySnapshot from '@percy/playwright'
import { testIds } from '@/lib/testids'

const sel = (id: string) => `[data-testid="${id}"]`

// Load the homepage in a deterministic, animation-free state:
// reduced motion disables scroll-reveal (sections render in their final state)
// and we let fonts settle so text metrics don't shift between runs.
async function gotoHome(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByTestId(testIds.sections.contact).scrollIntoViewIfNeeded()
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.scrollTo(0, 0))
}

// Per-section snapshots isolate a regression to the section that changed,
// instead of flipping one giant full-page diff. Grouped under one Percy
// test case so the dashboard reads like a spec.
const SECTIONS = [
  ['Hero', testIds.sections.hero],
  ['About', testIds.sections.about],
  ['Skills', testIds.sections.skills],
  ['Testing showcase', testIds.sections.testing],
  ['Contact', testIds.sections.contact],
] as const

test.describe('Visual  -  homepage', () => {
  test('full page and sections', async ({ page }) => {
    await gotoHome(page)
    await percySnapshot(page, 'Home / Full page', { testCase: 'Homepage' })
    for (const [name, id] of SECTIONS) {
      await percySnapshot(page, `Home / ${name}`, { scope: sel(id), testCase: 'Homepage' })
    }
  })
})

test.describe('Visual  -  contact form', () => {
  test('validation errors', async ({ page }) => {
    await gotoHome(page)
    // Submit an empty form: client-side validation renders inline errors,
    // no network involved, so it is fully deterministic.
    await page.getByTestId(testIds.contact.submit).click()
    await page.getByTestId(testIds.contact.messageError).waitFor()
    await percySnapshot(page, 'Contact / Validation errors', {
      scope: sel(testIds.sections.contact),
      testCase: 'Contact form',
    })
  })

  test('message sent toast', async ({ page }) => {
    // Mock the POST so CI never writes to SQLite or burns the rate limit.
    await page.route('**/api/contact', route => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
      }
      return route.continue()
    })
    await gotoHome(page)
    await page.getByTestId(testIds.contact.nameInput).fill('Ada Lovelace')
    await page.getByTestId(testIds.contact.emailInput).fill('ada@example.com')
    await page.getByTestId(testIds.contact.messageInput).fill('Great visual regression coverage on this site.')
    await page.getByTestId(testIds.contact.submit).click()
    await page.getByTestId(testIds.contact.toast).waitFor()
    // Let the toast's entrance (check-draw + ripple) settle before capture.
    await page.waitForTimeout(1500)
    await percySnapshot(page, 'Contact / Message sent', {
      testCase: 'Contact form',
      // Pin the 5s countdown bar (JS-driven, not covered by the global
      // animation-zeroing CSS) to a fixed state so the diff is stable.
      percyCSS: '[data-testid="contact-toast"] > span:last-of-type { transform: scaleX(1) !important; }',
    })
  })
})
