import { defineConfig, devices } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env from repo root into process.env so skip guards in specs evaluate correctly.
// dotenv is not installed; parse manually using Node built-ins.
try {
  const envPath = resolve(__dirname, '..', '.env')
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
} catch {
  // .env not present — CI will have vars set via environment
}

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: '../playwright-report', open: process.env.CI ? 'never' : 'always' }],
    ['list'],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], extraHTTPHeaders: { 'X-Forwarded-For': '10.0.0.1' } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], extraHTTPHeaders: { 'X-Forwarded-For': '10.0.0.2' } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], extraHTTPHeaders: { 'X-Forwarded-For': '10.0.0.3' } } },
  ],
})
