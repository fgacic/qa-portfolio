export const SITE_URL = 'https://fgacic.com'
export const GITHUB_REPO = 'https://github.com/fgacic/qa-portfolio'
export const LINKEDIN = 'https://www.linkedin.com/in/filip-ga%C4%8Di%C4%87-668ab720a/'
export const EMAIL = 'filip.gacic98@gmail.com'

const TRACKED_BRANCHES = ['main', 'test'] as const
const RAW_BRANCH = process.env.GIT_BRANCH ?? 'main'
const CI_BRANCH = (TRACKED_BRANCHES as readonly string[]).includes(RAW_BRANCH) ? RAW_BRANCH : 'main'

export const CI_WORKFLOW = `${GITHUB_REPO}/actions/workflows/ci.yml?query=branch%3A${CI_BRANCH}`
export const CI_BADGE = `${GITHUB_REPO}/actions/workflows/ci.yml/badge.svg?branch=${CI_BRANCH}`
export const PLAYWRIGHT_REPORT_URL = 'https://fgacic.github.io/qa-portfolio/playwright-report'
export const K6_REPORT_URL = 'https://fgacic.github.io/qa-portfolio/k6-report'
export const PERCY_PROJECT_URL = 'https://percy.io'
