# fgacic.com — QA Engineer Portfolio

> **The repo is the portfolio.** Anyone reading this is looking at the same artefacts I produce at work: a production-grade CI pipeline, three test disciplines, and a deployment strategy I own end-to-end.

[![CI](https://github.com/fgacic/home/actions/workflows/ci.yml/badge.svg)](https://github.com/fgacic/home/actions/workflows/ci.yml)
[![Playwright Report](https://img.shields.io/badge/Playwright-report-7c3aed)](https://fgacic.github.io/home/playwright-report)

---

## What this is

A personal site built with **Next.js 15 + TypeScript + Tailwind + Motion**. The site itself is the test subject — Playwright E2E tests, Playwright API tests, and k6 load tests all target it, and they all gate deployment.

If you're hiring and you want to know how I approach quality, the `tests/` and `k6/` directories answer that better than any CV bullet point.

---

## Repo map

```
/
├── app/                    Next.js App Router (pages, API routes, styles)
│   └── api/health/         GET /api/health — used by API tests + k6
├── components/             React components (all 'use client', all animated)
├── tests/                  Playwright — E2E, navigation, API tests
│   └── playwright.config.ts
├── k6/
│   ├── smoke.js            CI gate — 5 VUs, 30 s
│   └── load.js             Manual — 100 VUs, 2 min ramp, p95 threshold
├── .github/workflows/
│   └── ci.yml              Full pipeline (see below)
└── Dockerfile              Multi-stage standalone build
```

---

## Test strategy

### Three disciplines, one repo

| Layer | Tool | When | What it proves |
|---|---|---|---|
| E2E | Playwright | Every push | Pages render, navigation works, no JS errors |
| API | Playwright (`request` fixture) | Every push | `/api/health` returns correct shape and latency |
| Load | k6 smoke | Every push | Site holds under 5 VUs, p95 < 2 s |
| Load | k6 load | Manual / scheduled | p95 < 1 s under 100 VUs over 2 min |

### Why Playwright for API tests?

The same CI job that spins up the Next.js server for E2E also runs the API tests using Playwright's `request` fixture — no separate tool, no extra setup, same HTML report. It demonstrates that Playwright isn't just a browser tool.

### Why k6 in CI at all?

The **smoke test** (5 VUs, 30 s) is a cheap regression check: if a deploy causes a latency spike or starts returning 500s under minimal load, it fails before Coolify ever ships the container. The **load test** is kept out of CI intentionally — it's a deliberate, monitored exercise run against the live URL, not a checkbox.

---

## CI pipeline

Every push to `main` or any PR runs:

```
yarn install
  └── yarn lint
      └── yarn build
          └── playwright install (chromium + firefox)
              └── node .next/standalone/server.js  (production build)
                  ├── Playwright tests (E2E + API)  →  upload HTML report as artifact
                  └── k6 smoke test                 →  upload summary as artifact

On merge to main only:
  └── Publish Playwright report → GitHub Pages
```

The full definition is in `.github/workflows/ci.yml`. No external services, no paid integrations.

---

## Docker

### Why standalone output?

`next.config.ts` sets `output: 'standalone'`. Next.js traces every file the app actually needs and writes a self-contained bundle to `.next/standalone/`. The Docker image copies only that bundle — no `node_modules`, no source, no build cache. Result: a ~150 MB image instead of ~1 GB.

### Multi-stage build

```
Stage 1 — builder (node:20-alpine)
  Install all deps  →  yarn build  →  produces .next/standalone/

Stage 2 — runner (node:20-alpine)
  Copy .next/standalone/    (the server + its traced deps)
  Copy .next/static/        (hashed JS/CSS chunks)
  Copy public/              (favicon, hero image, cv.pdf)
  Run as non-root user nextjs:nodejs
  CMD node server.js
```

### How Coolify deploys it

1. **Coolify** watches this GitHub repo via webhook.
2. On every push to `main` — after CI passes — Coolify triggers a new build.
3. Coolify runs `docker build` using the `Dockerfile` at repo root on the Hetzner VPS.
4. It starts the new container, binding port 3000 internally.
5. **Cloudflare** proxies the public domain to the VPS — handles TLS, caching, and DDoS protection.

`HOSTNAME=0.0.0.0` in the Dockerfile tells the standalone server to bind on all interfaces, not just localhost, so Coolify's reverse proxy can reach it.

### Running the image locally

```bash
yarn build
docker build -t fgacic .
docker run -p 3000:3000 fgacic
# open http://localhost:3000
```

---

## Running tests locally

Requires: Node 20, yarn, [k6](https://k6.io/docs/get-started/installation/) installed globally.

```bash
# Start the production server (Playwright needs this)
yarn build && node .next/standalone/server.js &

# E2E + API tests (from repo root)
cd tests && npx playwright test

# k6 smoke — run on every change
k6 run k6/smoke.js --env BASE_URL=http://localhost:3000

# k6 load — run deliberately against live URL only
k6 run k6/load.js --env BASE_URL=https://fgacic.com
```

---

## Tech choices

| Decision | Rationale |
|---|---|
| **Next.js 15 App Router** | API routes co-located with the site — one deployable, one test target |
| **`motion/react`** not `framer-motion` | framer-motion v11 has a webpack CJS conflict with Next.js 15.5+ dev server; `motion/react` is the canonical package and resolves cleanly |
| **Tailwind v4** | CSS `@theme` replaces config files; PostCSS plugin integrates with Next.js natively |
| **Playwright `request` for API tests** | Reuses the browser test infrastructure; single HTML report covers E2E and API |
| **k6 smoke in CI, load test manual** | Smoke catches regressions cheaply; load test is a deliberate exercise, not checkbox CI |
| **`output: standalone`** | Minimal Docker image — no `node_modules` in the container |

---

## TODO

- [ ] Replace `public/cv.pdf` placeholder with actual CV
- [ ] Update GitHub repo URLs in `TestingShowcase.tsx` with real links once pushed
- [ ] Schedule weekly k6 load run via GitHub Actions cron against live URL
- [ ] Add Lighthouse CI step for Core Web Vitals regression gating
- [ ] Wire real Playwright report URL into the Testing Showcase cards
