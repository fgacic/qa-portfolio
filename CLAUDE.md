# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**fgacic.com** — QA Engineer portfolio site built with Next.js 15 App Router + TypeScript + Tailwind CSS v4. The repo itself demonstrates production-grade testing: Playwright (E2E + API), k6 (load), and a full CI/CD pipeline.

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
k6 run k6/load.js --env BASE_URL=https://fgacic.com  # Manual only, not CI
PERCY_TOKEN=... npx percy exec -- yarn playwright:visual  # Visual regression (Percy)
```

## Architecture

**Single-page app** — `app/page.tsx` composes all sections; all components live in `components/` and are `'use client'`.

**API routes** (`app/api/`):
- `GET /api/health` — health check
- `POST /api/contact` — validates input, rate-limits (3/hour per IP, in-memory), stores to SQLite
- `GET /api/contact` — admin endpoint, gated by Cloudflare Access JWT
- `GET /api/projects` — project list from `lib/projects.ts`
- `PATCH /api/admin/submissions/[id]` — mark submission read; CF Access gated
- `DELETE /api/admin/submissions/[id]` — soft-delete submission; CF Access gated

**Admin Dashboard** — `/admin` route gated by Cloudflare Access (email OTP / identity provider). CF Access intercepts unauthenticated requests at the edge and redirects to the login flow before the app is ever reached. The layout and page both verify the JWT for defense in depth. Signed-in email is shown in the top bar; sign-out points to `/cdn-cgi/access/logout`.

Soft-delete semantics: deleting a submission sets `deleted_at` in SQLite; the row is excluded from the default query but retained in the database. Pass `{ includeDeleted: true }` to `getAllSubmissions()` to include deleted rows.

**Data layer** — SQLite via `better-sqlite3` (WAL mode). DB path: `$DATA_DIR/db.sqlite` (default `./data/`). Schema initialised on first start in `lib/db.ts`. Additive columns (`read_at`, `deleted_at`) added via `ALTER TABLE … ADD COLUMN` wrapped in try/catch for idempotency. No migrations — dev-only portfolio.

**Rate limiting** — in-memory map in `lib/rateLimit.ts`; resets on restart (intentional).

## Testing

Three disciplines, one repo:

| Type | Tool | When | Config |
|------|------|------|--------|
| E2E | Playwright | Every push | `tests/playwright.config.ts` — Chromium, Firefox, mobile (Pixel 7) |
| API | Playwright `request` | Every push | Same job as E2E |
| Load (smoke) | k6 | Every push | `k6/smoke.js` — 5 VUs, 30s, p95<2s |
| Load (full) | k6 | Manual | `k6/load.js` — 100 VUs, 2-min ramp, p95<1s |
| Visual | Percy | Manual (CI dispatch, requires `PERCY_TOKEN`) | `.percy.yml`, `tests/visual.config.ts` — widths 375/768/1280 |

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
| `BASE_URL` | Used by Playwright and k6 | `http://localhost:3000` |
| `RESEND_API_KEY` | Resend API key for contact email notifications | *(required in prod)* |
| `NOTIFY_EMAIL` | Address that receives contact notifications | `filip.gacic98@gmail.com` |
| `FROM_EMAIL` | Sender address (must be a verified Resend domain) | `contact@fgacic.com` |
| `CF_ACCESS_TEAM_DOMAIN` | Cloudflare Access team domain (e.g. `myteam.cloudflareaccess.com`) | *(required in prod)* |
| `CF_ACCESS_AUD` | Cloudflare Access application audience tag | *(required in prod)* |
| `ADMIN_DEV_BYPASS` | Skip CF Access JWT check in non-production environments | `false` |
| `PERCY_TOKEN` | Percy project token for visual regression snapshots (CI step is skipped when unset) | *(unset; set as GitHub Actions secret)* |
