# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**fgacic.dev** — QA Engineer portfolio site built with Next.js 15 App Router + TypeScript + Tailwind CSS v4. The repo itself demonstrates production-grade testing: Playwright (E2E + API), k6 (load), and a full CI/CD pipeline.

## Commands

```bash
yarn dev              # Dev server (port 3000)
yarn build            # Build standalone app + copy static/public
yarn start            # Run production build (node .next/standalone/server.js)
yarn lint             # ESLint

# Tests — must run against a started server (yarn build && yarn start &)
cd tests && npx playwright test                  # All E2E + API tests
cd tests && npx playwright test e2e/hero.spec.ts # Single spec file
k6 run k6/smoke.js --env BASE_URL=http://localhost:3000
k6 run k6/load.js --env BASE_URL=https://fgacic.dev  # Manual only, not CI
```

## Architecture

**Single-page app** — `app/page.tsx` composes all sections; all components live in `components/` and are `'use client'`.

**API routes** (`app/api/`):
- `GET /api/health` — health check
- `POST /api/contact` — validates input, rate-limits (3/hour per IP, in-memory), stores to SQLite
- `GET /api/contact` — admin endpoint (Bearer token via `ADMIN_TOKEN` env var)
- `GET /api/projects` — project list from `lib/projects.ts`

**Data layer** — SQLite via `better-sqlite3` (WAL mode). DB path: `$DATA_DIR/db.sqlite` (default `./data/`). Schema initialised on first start in `lib/db.ts`. No migrations — dev-only portfolio.

**Rate limiting** — in-memory map in `lib/rateLimit.ts`; resets on restart (intentional).

## Testing

Three disciplines, one repo:

| Type | Tool | When | Config |
|------|------|------|--------|
| E2E | Playwright | Every push | `tests/playwright.config.ts` — Chromium, Firefox, mobile (Pixel 7) |
| API | Playwright `request` | Every push | Same job as E2E |
| Load (smoke) | k6 | Every push | `k6/smoke.js` — 5 VUs, 30s, p95<2s |
| Load (full) | k6 | Manual | `k6/load.js` — 100 VUs, 2-min ramp, p95<1s |

Playwright config: 2 retries in CI, 1 worker (sequential), HTML report → `playwright-report/`, screenshot on failure, trace on first retry.

## Deployment

**Build output** — `output: 'standalone'` in `next.config.ts`; produces ~150 MB Docker image.

**Docker** — multi-stage (node:20-alpine builder → runner); runs as non-root `nextjs:nodejs` (UID 1001).

**Stack**: GitHub Actions CI → Coolify (webhook) → Docker on Hetzner VPS, fronted by Cloudflare (TLS + proxy).

**CI pipeline** (`.github/workflows/ci.yml`): lint → build → Playwright tests → k6 smoke → publish Playwright report to GitHub Pages (main branch only).

## Key Decisions

- `motion/react` (not `framer-motion`) — avoids webpack CJS conflict in Next.js 15.5+ dev server
- Tailwind v4 uses CSS `@theme` instead of a config file
- Playwright handles both E2E and API tests — single HTML report, no extra tooling
- k6 smoke in CI (cheap regression gate); full load test is deliberate and manual

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `DATA_DIR` | SQLite DB + data files location | `./data` |
| `ADMIN_TOKEN` | Bearer token for `GET /api/contact` | `dev-token` |
| `BASE_URL` | Used by Playwright and k6 | `http://localhost:3000` |
