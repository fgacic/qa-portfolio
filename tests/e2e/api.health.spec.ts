import { test, expect } from '@playwright/test'

test.describe('API — /api/health', () => {
  test('returns HTTP 200', async ({ request }) => {
    const res = await request.get('/api/health')
    expect(res.status()).toBe(200)
  })

  test('returns JSON content-type', async ({ request }) => {
    const res = await request.get('/api/health')
    expect(res.headers()['content-type']).toContain('application/json')
  })

  test('body has status: ok', async ({ request }) => {
    const res = await request.get('/api/health')
    const body = await res.json()
    expect(body.status).toBe('ok')
  })

  test('body has numeric ts timestamp', async ({ request }) => {
    const before = Date.now()
    const res = await request.get('/api/health')
    const after = Date.now()
    const { ts } = await res.json()
    expect(typeof ts).toBe('number')
    expect(ts).toBeGreaterThanOrEqual(before)
    expect(ts).toBeLessThanOrEqual(after + 50)
  })

  test('responds within 500 ms', async ({ request }) => {
    const start = Date.now()
    await request.get('/api/health')
    expect(Date.now() - start).toBeLessThan(500)
  })
})
