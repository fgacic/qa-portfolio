import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        gap: '1.5rem',
      }}
    >
      <p
        style={{
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#a855f7',
          margin: 0,
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 600,
          color: 'var(--text)',
          margin: 0,
          lineHeight: 1.1,
          maxWidth: '32rem',
        }}
      >
        This page broke before I could test it.
      </h1>
      <p
        style={{
          color: 'var(--text-muted)',
          maxWidth: '32rem',
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        The link you followed doesn&rsquo;t exist on this site. It might have moved, or never existed.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          color: '#a5b4fc',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: 500,
          marginTop: '0.5rem',
        }}
      >
        ← Back to home
      </Link>
    </main>
  )
}
