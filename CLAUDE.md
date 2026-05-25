# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**fgacic.com** — QA Engineer portfolio site built with Next.js 15 App Router + TypeScript + Tailwind CSS v4. The repo itself demonstrates production-grade testing: Playwright (E2E + API), k6 (load), and a full CI/CD pipeline.

**Public repo** (`github.com/fgacic/qa-portfolio`) — treat anything committed as world-readable. Secrets live in env vars only (Coolify for prod, `.env.local` for dev — both gitignored). History was scrubbed via `git filter-repo` before flipping to public; do not re-introduce `data/*.sqlite*` to the tracked tree.

## Commands

```bash
yarn dev              # Dev server (port 3000)
yarn build            # Build standalone app + copy static/public
yarn start            # Run production build (node .next/standalone/server.js)
yarn lint             # ESLint

# Tests — must run against a started server with email disabled
# yarn build && yarn start:test &
yarn playwright:test                  # All E2E + API tests
yarn playwright:test e2e/hero.spec.ts # Single spec file
yarn playwright:report                # Open last HTML report
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

**Docker** — multi-stage (node:20-alpine builder → runner); runs as non-root `nextjs:nodejs` (UID 1001). Listens on `0.0.0.0:3000`; persists SQLite to `/app/data` (mount a Coolify volume here).

**Stack**: GitHub Actions CI → Coolify (webhook) → Docker on Hetzner VPS → Cloudflare DNS + proxy → Cloudflare Zero Trust (Access).

**Deploy flow** — CI is the deploy gate. On push to `main`:
1. GitHub Actions: lint → build → Playwright tests → k6 smoke → publish Playwright report to GitHub Pages → call Coolify deploy webhook.
2. Coolify (self-hosted on the Hetzner VPS) receives the webhook only after CI passes, pulls the new commit, rebuilds the Docker image from `Dockerfile`, and rolls the container.

Coolify's own GitHub webhook / auto-deploy is **disabled** — Coolify only deploys when triggered by the CI webhook step. The `COOLIFY_DEPLOY_URL` (auth-required deploy webhook URL from the Coolify application) and `COOLIFY_GITHUB_API_TOKEN` (API token with `deploy` scope, generated under Keys & Tokens → API Tokens) secrets must be set per GitHub Environment (`Test` and `Prod`).

**Cloudflare layers**:
- **DNS + proxy (orange-cloud)** — `fgacic.com` and `www` proxy through Cloudflare; TLS terminates at the edge, then re-encrypts to the Hetzner origin. The container itself does not handle TLS.
- **Zero Trust / Access** — Cloudflare Access policy in front of `/admin` and `/api/admin/*` (and `GET /api/contact`). Unauthenticated requests are intercepted at the edge and redirected to the email-OTP / IdP login before ever hitting the app. The app still verifies the `Cf-Access-Jwt-Assertion` header against `CF_ACCESS_TEAM_DOMAIN` + `CF_ACCESS_AUD` as defence-in-depth. Sign-out goes to `/cdn-cgi/access/logout`.
- For local admin work without CF Access in front, set `ADMIN_DEV_BYPASS=true` (refused in production).

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
| `NEXT_PUBLIC_ENABLE_DOWNLOAD_CV` | Feature flag — set to `true` to show the Download CV button in the About section | `false` (hidden) |
