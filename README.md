# fgacic.com — QA Engineer Portfolio

Next.js 15 portfolio with Playwright browser/API tests, Percy visual snapshots, and k6 smoke/load tests.

## Local development

Requires Node 20 and Yarn Classic.

```bash
yarn install --frozen-lockfile
yarn dev
```

The contact form uses Cloudflare Turnstile public test keys in development. To test without sending email, set `DISABLE_EMAIL=true` locally. For real delivery, set `RESEND_API_KEY` and verify `fgacic.com` in Resend. Copy `.env.example` to `.env.local` for the variable list. Do not commit credentials.

## Vercel Hobby setup

1. Import `fgacic/qa-portfolio` into a personal Vercel account. Use the Next.js framework preset, repository root, and Yarn Classic. Vercel deploys the connected branch without a Docker image or Coolify trigger.
2. In Vercel's Production environment variables, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `FROM_EMAIL=contact@fgacic.com`, and `NOTIFY_EMAIL=filip.gacic98@gmail.com`. Use real Turnstile keys. Register the Vercel production hostname and `fgacic.com` in the Turnstile widget. Verify the sending domain in Resend and set its DNS records in Cloudflare.
3. Test the production Vercel URL before DNS cutover, including a real contact submission and receipt in the inbox. Confirm `/admin` and `GET /api/contact` no longer reveal submissions.
4. Back up existing Coolify SQLite submissions before switching the domain. After the Vercel URL is verified, attach `fgacic.com` and `www.fgacic.com` in Vercel, then update only the website DNS records in Cloudflare to Vercel's instructions. Keep mail, Coolify, and other DNS records intact. Remove the old Coolify production application only after the domain and contact delivery work on Vercel.

The contact endpoint stores no submissions. It validates fields, verifies Turnstile on the server, awaits Resend, and returns success only after Resend accepts the message. Delivery failure returns 503 so the visitor can retry. `DISABLE_EMAIL` is ignored in production.

Vercel Hobby is intended for personal, noncommercial use. Check that the portfolio's use fits [Vercel's Hobby terms](https://vercel.com/docs/plans/hobby) before launch.

## Tests

```bash
yarn lint
yarn build
# With a local dev server running and DISABLE_EMAIL=true:
yarn playwright:test
k6 run k6/smoke.js --env BASE_URL=http://localhost:3000
```

GitHub Actions runs lint, build, Playwright, optional Percy, and k6 on pull requests and pushes to `main`. Test reports are workflow artifacts. Vercel Git integration handles deployments. Configure a Vercel Deployment Check if production promotion must wait for CI to pass.
