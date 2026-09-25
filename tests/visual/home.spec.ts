import { test, type Page } from '@playwright/test'
import percySnapshot from '@percy/playwright'
import { testIds } from '@/lib/testids'

const sel = (id: string) => `[data-testid="${id}"]`

test.beforeAll(() => {
  if (!process.env.PERCY_SERVER_ADDRESS) {
    throw new Error('Percy is not running. Run visual tests with `percy exec -- yarn playwright:visual`.')
  }
})

// Load the homepage in a deterministic, animation-free state:
// reduced motion disables scroll-reveal (sections render in their final state)
// and we let fonts settle so text metrics don't shift between runs.
async function gotoHome(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByTestId(testIds.sections.contact).scrollIntoViewIfNeeded()
  await page.getByTestId(testIds.contact.form).waitFor()
  await page.waitForFunction(() => document.querySelector('[data-testid="contact-form"]')?.getAttribute('data-ready') === 'true')
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.scrollTo(0, 0))
}

// Let page scripts run in Playwright (including Turnstile for form submission),
// then strip them from the static DOM Percy renders. Scripts in the captured
// DOM cause Firefox render timeouts at tablet and desktop widths.
async function removeScriptsForPercy(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('script').forEach(script => script.remove())
  })
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
    await removeScriptsForPercy(page)
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
    await removeScriptsForPercy(page)
    await percySnapshot(page, 'Contact / Validation errors', {
      scope: sel(testIds.sections.contact),
      testCase: 'Contact form',
    })
  })

  test('message sent toast', async ({ page }) => {
    // Mock the POST so visual tests do not send email.
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
    await page.locator('[name="cf-turnstile-response"]').waitFor({ state: 'attached' })
    await page.waitForFunction(() => Boolean((document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value))
    await page.getByTestId(testIds.contact.submit).click()
    await page.getByTestId(testIds.contact.toast).waitFor()
    // Let the toast's entrance (check-draw + ripple) settle before capture.
    await page.waitForTimeout(1500)
    await removeScriptsForPercy(page)
    await percySnapshot(page, 'Contact / Message sent', {
      testCase: 'Contact form',
      // Pin the 5s countdown bar (JS-driven, not covered by the global
      // animation-zeroing CSS) to a fixed state so the diff is stable.
      percyCSS: '[data-testid="contact-toast"] > span:last-of-type { transform: scaleX(1) !important; }',
    })
  })
})
