# fgacic.com — QA Engineer Portfolio

Next.js 15 portfolio with Playwright browser/API tests, Percy visual snapshots, and k6 smoke/load tests.

## Local development

Requires Node 20 and Yarn Classic.

```bash
yarn install --frozen-lockfile
yarn dev
```

The contact form uses Cloudflare Turnstile public test keys in development. To test without sending email, set `DISABLE_EMAIL=true` locally. For real delivery, set `RESEND_API_KEY` and verify `fgacic.com` in Resend. Copy `.env.example` to `.env.local` for the variable list. Do not commit credentials.

## Production hosting

The portfolio runs on Vercel Hobby at [www.fgacic.com](https://www.fgacic.com). `fgacic.com` redirects there. Vercel deploys `main` through its GitHub integration using the Next.js preset and Yarn Classic. The former Coolify portfolio application and its SQLite storage have been removed.

Cloudflare manages DNS and Turnstile. The website CNAME records for `fgacic.com` and `www.fgacic.com` point to the target shown in Vercel's Domains settings with Cloudflare proxying disabled. Keep the mail and unrelated application records intact when changing website DNS. The Turnstile widget allows both custom domains and the Vercel production hostname.

Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, and `RESEND_API_KEY` in Vercel's **Production** environment. The sender defaults to `contact@fgacic.com`, and notifications go to `filip.gacic98@gmail.com`; use `FROM_EMAIL` and `NOTIFY_EMAIL` only to override those defaults. The sending domain must remain verified in Resend. Redeploy after changing an environment variable.

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
