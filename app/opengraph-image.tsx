import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Filip Gačić — QA Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0c',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          fontFamily: 'sans-serif',
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.18), transparent 55%)',
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: '#a855f7',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          QA Engineer
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 600,
            color: '#e8e6f0',
            lineHeight: 1.05,
            marginBottom: 28,
          }}
        >
          Filip Gačić
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#8a8699',
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          End-to-end testing with Playwright · API testing · Load &amp; performance with k6
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 80,
            fontSize: 24,
            color: '#6366f1',
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          fgacic.com
        </div>
      </div>
    ),
    size,
  )
}
