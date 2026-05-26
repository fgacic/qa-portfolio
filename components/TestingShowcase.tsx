'use client'

import { motion } from 'motion/react'

const TESTS = [
  {
    id: 'e2e',
    label: 'End-to-End',
    tool: 'Playwright',
    accent: '#a855f7',
    description:
      'Full browser automation covering navigation, form interactions, visual regression, and cross-browser checks. Runs on every push via GitHub Actions.',
    snippet: `test('hero renders correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await expect(page).toHaveTitle(/QA Engineer/)
})`,
    badgeUrl: 'https://github.com',
    reportUrl: 'https://fgacic.github.io/qa-portfolio/playwright-report',
  },
  {
    id: 'api',
    label: 'API Testing',
    tool: 'Playwright request',
    accent: '#6366f1',
    description:
      'Request-level validation of all API routes — status codes, response schemas, error handling, and latency budgets. No browser overhead.',
    snippet: `test('health endpoint', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.status()).toBe(200)
  const body = await res.json()
  expect(body).toMatchObject({ status: 'ok' })
})`,
    badgeUrl: 'https://github.com',
    reportUrl: 'https://fgacic.github.io/qa-portfolio/playwright-report',
  },
  {
    id: 'load',
    label: 'Load & Performance',
    tool: 'k6',
    accent: '#38bdf8',
    description:
      'Smoke tests (5 VUs) gate every deployment. Load scenarios (100 VUs, 2 min) validate p95 latency stays under 1s under realistic traffic.',
    snippet: `export const options = { vus: 5, duration: '30s' }

export default function () {
  const res = http.get(__ENV.BASE_URL)
  check(res, { 'status 200': (r) => r.status === 200 })
  sleep(1)
}`,
    badgeUrl: 'https://github.com',
    reportUrl: 'https://fgacic.github.io/qa-portfolio/k6-report',
  },
  {
    id: 'visual',
    label: 'Visual Regression',
    tool: 'Percy',
    accent: '#10b981',
    description:
      'DOM snapshots of the homepage at mobile, tablet, and desktop widths. Pixel diffs surface unintentional layout shifts before they ship — animations are frozen and the globe is masked for determinism.',
    snippet: `test('home — full page', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await percySnapshot(page, 'Home — full page')
})`,
    badgeUrl: 'https://github.com',
    reportUrl: 'https://percy.io',
    reportLabel: 'View visual snapshots →',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function TestingShowcase() {
  return (
    <section
      id="testing"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6rem' }}
    >
      <div className="section">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Portfolio
        </motion.p>

        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          This site is the test subject
        </motion.h2>

        <motion.p
          className="section-body"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2.5rem' }}
        >
          Four test suites live in the same repo as this site and run on every push.
          The CI pipeline gates deployment — no green tests, no deploy.
        </motion.p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 20rem), 1fr))',
            gap: '1.25rem',
          }}
        >
          {TESTS.map((t, i) => (
            <motion.div
              key={t.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              style={{
                borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.025)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: '1.25rem 1.25rem 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: t.accent,
                      marginBottom: '0.3rem',
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--text)',
                    }}
                  >
                    {t.tool}
                  </div>
                </div>

                {/* CI badge placeholder */}
                <a
                  href={t.badgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '0.35rem',
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: 'rgba(134, 239, 172, 0.9)',
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}
                >
                  ● passing
                </a>
              </div>

              {/* Description */}
              <p
                style={{
                  padding: '0.75rem 1.25rem',
                  margin: 0,
                  fontSize: '0.85rem',
                  lineHeight: 1.65,
                  color: 'var(--text-muted)',
                }}
              >
                {t.description}
              </p>

              {/* Code snippet */}
              <pre
                style={{
                  margin: '0 1.25rem 1.25rem',
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '0.6rem',
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '0.72rem',
                  lineHeight: 1.65,
                  color: 'rgba(199, 210, 254, 0.75)',
                  overflowX: 'auto',
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  whiteSpace: 'pre',
                }}
              >
                <code>{t.snippet}</code>
              </pre>

              {/* View link */}
              {t.reportUrl && (
                <a
                  href={t.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '0.75rem 1.25rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.8rem',
                    color: t.accent,
                    textDecoration: 'none',
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                    opacity: 0.8,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8' }}
                >
                  {t.reportLabel ?? 'View test report →'}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  )
}
