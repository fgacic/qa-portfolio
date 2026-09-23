import { test, expect } from '@playwright/test'

const VALID = { name: 'Test User', email: 'test@example.com', message: 'This is a test message for the contact form.', turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX' }

test.describe('API  -  POST /api/contact', () => {
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

  test('returns 422 when message exceeds 500 chars', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { ...VALID, message: 'a'.repeat(501) } })
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

  test('rejects missing verification', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { ...VALID, turnstileToken: '' } })
    expect(res.status()).toBe(403)
  })

  test('does not expose submissions through GET', async ({ request }) => {
    const res = await request.get('/api/contact')
    expect(res.status()).toBe(405)
  })
})
