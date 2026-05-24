import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './visual',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'off',
    screenshot: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
