import { test, expect } from '@playwright/test'

test.describe('API — GET /api/projects', () => {
  test('returns 200', async ({ request }) => {
    const res = await request.get('/api/projects')
    expect(res.status()).toBe(200)
  })

  test('response has projects array', async ({ request }) => {
    const res = await request.get('/api/projects')
    const body = await res.json()
    expect(Array.isArray(body.projects)).toBe(true)
    expect(body.projects.length).toBeGreaterThan(0)
  })

  test('each project has required fields', async ({ request }) => {
    const res = await request.get('/api/projects')
    const { projects } = await res.json()
    for (const p of projects) {
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('category')
      expect(p).toHaveProperty('url')
      expect(p).toHaveProperty('tags')
      expect(p).toHaveProperty('accent')
      expect(Array.isArray(p.tags)).toBe(true)
    }
  })

  test('?tag= filter returns matching projects', async ({ request }) => {
    const res = await request.get('/api/projects?tag=Web3')
    const { projects } = await res.json()
    expect(projects.length).toBeGreaterThan(0)
    for (const p of projects) {
      expect(p.tags.map((t: string) => t.toLowerCase())).toContain('web3')
    }
  })

  test('?tag= filter is case-insensitive', async ({ request }) => {
    const upper = await (await request.get('/api/projects?tag=WEB3')).json()
    const lower = await (await request.get('/api/projects?tag=web3')).json()
    expect(upper.projects.length).toBe(lower.projects.length)
  })

  test('unknown tag returns empty array', async ({ request }) => {
    const res = await request.get('/api/projects?tag=doesnotexistzzz')
    const { projects } = await res.json()
    expect(projects).toHaveLength(0)
  })
})
