// Auth tests in this file assume ADMIN_DEV_BYPASS is NOT set.
// When the bypass is active (local dev), all tests in this file are skipped.
import { test, expect } from '@playwright/test'

const bypassOn = !!process.env.ADMIN_DEV_BYPASS

test.describe('Admin auth gating — requires ADMIN_DEV_BYPASS unset', () => {
  test.skip(bypassOn, 'auth tests require ADMIN_DEV_BYPASS unset')

  test('GET /api/contact returns 401 without JWT', async ({ request }) => {
    const res = await request.get('/api/contact')
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('unauthorized')
  })

  test('PATCH /api/admin/submissions/:id returns 401 without JWT', async ({ request }) => {
    const res = await request.patch('/api/admin/submissions/test-id', {
      data: { read: true },
      headers: { 'content-type': 'application/json' },
    })
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('unauthorized')
  })

  test('DELETE /api/admin/submissions/:id returns 401 without JWT', async ({ request }) => {
    const res = await request.delete('/api/admin/submissions/test-id')
    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('unauthorized')
  })
})
