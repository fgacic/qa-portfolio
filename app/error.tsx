'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[error.tsx]', error)
  }, [error])

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
          color: '#f87171',
          margin: 0,
        }}
      >
        Unexpected error
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
        Something broke. Ironic.
      </h1>
      <p
        style={{
          color: 'var(--text-muted)',
          maxWidth: '32rem',
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        The page hit an unexpected error. Try again, or head back to the home page.
      </p>
      {error.digest && (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontFamily: "'Fira Code', monospace",
            opacity: 0.6,
            margin: 0,
          }}
        >
          ref: {error.digest}
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            color: '#a5b4fc',
            fontSize: '0.95rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
