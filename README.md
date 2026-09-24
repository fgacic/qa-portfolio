# fgacic.com — QA Engineer Portfolio

Next.js 15 portfolio with Playwright browser/API tests, Percy visual snapshots, and k6 smoke/load tests.

## Local development

Requires Node 20 and Yarn Classic.

```bash
yarn install --frozen-lockfile
yarn dev
```

For local contact form setup, copy `.env.example` to `.env.local`. Keep credentials out of Git.

## Tests

```bash
yarn lint
yarn build
# With a local dev server running and local test configuration:
yarn playwright:test
k6 run k6/smoke.js --env BASE_URL=http://localhost:3000
```

To upload visual snapshots, set `PERCY_TOKEN` in your shell and run `npx percy exec -- yarn playwright:visual` with the local server running. The visual suite requires a running Percy CLI.

GitHub Actions runs lint, build, Playwright, optional Percy, and k6 on pull requests and pushes to `main`. Test reports are workflow artifacts.
