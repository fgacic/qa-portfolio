import { test, expect } from '@playwright/test'

const VALID = { name: 'Test User', email: 'test@example.com', message: 'This is a test message for the contact form.' }

test.describe('API — POST /api/contact', () => {
  test('returns 200 with valid body', async ({ request }) => {
    const res = await request.post('/api/contact', { data: VALID })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(typeof body.id).toBe('string')
  })

  test('returns 422 when name is missing', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { email: VALID.email, message: VALID.message } })
    expect(res.status()).toBe(422)
  })

  test('returns 422 when email is invalid format', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { ...VALID, email: 'notanemail' } })
    expect(res.status()).toBe(422)
    const body = await res.json()
    expect(body.errors.some((e: { field: string }) => e.field === 'email')).toBe(true)
  })

  test('returns 422 when message is too short', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { ...VALID, message: 'short' } })
    expect(res.status()).toBe(422)
  })

  test('returns 422 when message exceeds 2000 chars', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { ...VALID, message: 'a'.repeat(2001) } })
    expect(res.status()).toBe(422)
  })

  test('422 response has errors array with field names', async ({ request }) => {
    const res = await request.post('/api/contact', { data: {} })
    expect(res.status()).toBe(422)
    const body = await res.json()
    expect(Array.isArray(body.errors)).toBe(true)
    expect(body.errors.length).toBeGreaterThan(0)
    expect(body.errors[0]).toHaveProperty('field')
    expect(body.errors[0]).toHaveProperty('message')
  })

  test('returns 429 after exceeding rate limit', async ({ request }) => {
    // Use a dedicated IP isolated from the project IP so this test's exhaustion
    // does not affect other tests (which use the per-project X-Forwarded-For header).
    const rlHeaders = { 'X-Forwarded-For': '10.99.0.1' }
    for (let i = 0; i < 3; i++) {
      await request.post('/api/contact', { data: { ...VALID, message: `Rate limit test attempt ${i} - enough chars` }, headers: rlHeaders })
    }
    const res = await request.post('/api/contact', { data: { ...VALID, message: 'This should be rate limited now.' }, headers: rlHeaders })
    expect(res.status()).toBe(429)
    const body = await res.json()
    expect(body.error).toBe('rate_limit_exceeded')
    expect(typeof body.retryAfter).toBe('number')
  })
})

// Auth-gating tests assume the server is running without ADMIN_DEV_BYPASS active.
// `yarn start` (production build) sets NODE_ENV=production which disables the bypass
// regardless of the env var, so CI is always covered. Skip locally when bypassing.
const skipIfBypass = process.env.ADMIN_DEV_BYPASS === 'true'

test.describe('API — GET /api/contact (CF Access gated)', () => {
  test.skip(skipIfBypass, 'ADMIN_DEV_BYPASS active — auth bypass enabled')

  test('returns 401 without Cf-Access-Jwt-Assertion header', async ({ request }) => {
    const res = await request.get('/api/contact')
    expect(res.status()).toBe(401)
  })

  test('returns 401 with invalid JWT', async ({ request }) => {
    const res = await request.get('/api/contact', {
      headers: { 'Cf-Access-Jwt-Assertion': 'not.a.valid.jwt' },
    })
    expect(res.status()).toBe(401)
  })
})
