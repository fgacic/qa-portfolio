# Filip Gačić | QA Engineer

I'm a QA Engineer with 5+ years of experience building automated checks for web products. This repository contains the source for my portfolio and the test suites I use to exercise it.

**[Explore the live portfolio](https://www.fgacic.com)** · [Selected work](https://www.fgacic.com/#work) · [Testing showcase](https://www.fgacic.com/#testing)

## QA work in this repository

| Area | What I demonstrate | Evidence |
| --- | --- | --- |
| Browser testing | Playwright checks for navigation, forms, keyboard access, and behavior across Chromium, Firefox, and a mobile viewport. | [End-to-end tests](tests/e2e) |
| API testing | Request-level checks for successful responses, validation errors, and response structure across the site's API routes. | [API tests](tests/e2e/api.contact.spec.ts) |
| Visual regression | Percy snapshots of the full page, individual sections, and contact form states, with motion and fonts stabilized for repeatable comparisons. | [Visual tests](tests/visual/home.spec.ts) |
| Performance | k6 smoke checks in CI and a separate load scenario with latency and error-rate thresholds. | [k6 scenarios](k6) |

GitHub Actions runs lint, build, browser and API tests, and k6 on pull requests and pushes to `main`. Percy snapshots run when configured. Reports are saved as workflow artifacts. The latest Playwright report from `main` is also [published on GitHub Pages](https://fgacic.github.io/qa-portfolio/). [View the CI workflow](.github/workflows/ci.yml).

The site is built with Next.js, React, and TypeScript. For my experience, projects, and approach to QA, [visit the portfolio](https://www.fgacic.com). To discuss QA work, [get in touch](https://www.fgacic.com/#contact).
