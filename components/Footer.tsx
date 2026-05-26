import { CI_BADGE, CI_WORKFLOW, EMAIL, GITHUB_REPO, LINKEDIN } from '@/lib/links'

const BUILT_WITH = [
  { label: 'Next.js', href: 'https://nextjs.org' },
  { label: 'Tailwind', href: 'https://tailwindcss.com' },
  { label: 'Playwright', href: 'https://playwright.dev' },
  { label: 'k6', href: 'https://k6.io' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '3rem 1.5rem 2.5rem',
        maxWidth: '64rem',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
      }}
    >
      <a
        href={CI_WORKFLOW}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="CI build status on GitHub Actions"
        style={{ display: 'inline-block', lineHeight: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CI_BADGE}
          alt="CI status"
          height={20}
          style={{ height: '20px', width: 'auto', verticalAlign: 'middle' }}
        />
      </a>

      <nav
        aria-label="Social and contact"
        style={{
          display: 'flex',
          gap: '1.25rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          GitHub
        </a>
        <span aria-hidden style={{ opacity: 0.4 }}>·</span>
        <a
          href={LINKEDIN}
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          LinkedIn
        </a>
        <span aria-hidden style={{ opacity: 0.4 }}>·</span>
        <a
          href={`mailto:${EMAIL}`}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {EMAIL}
        </a>
      </nav>

      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.75 }}>
        Built with{' '}
        {BUILT_WITH.map((tool, i) => (
          <span key={tool.label}>
            <a
              href={tool.href}
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {tool.label}
            </a>
            {i < BUILT_WITH.length - 1 && <span aria-hidden> · </span>}
          </span>
        ))}
      </p>

      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>
        © {year} Filip Gačić · QA Engineer
      </p>
    </footer>
  )
}
