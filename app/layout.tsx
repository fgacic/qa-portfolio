import type { Metadata } from 'next'
import Script from 'next/script'
import { DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SITE_URL } from '@/lib/links'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const TITLE = 'Filip Gačić, QA Engineer'
const DESCRIPTION =
  'QA Engineer portfolio showcasing end-to-end testing with Playwright, API testing, and load & performance testing with k6.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['QA Engineer', 'Playwright', 'k6', 'E2E testing', 'API testing', 'performance testing'],
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/logo-32.png', sizes: '32x32', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <Script id="reset-scroll-on-reload" strategy="beforeInteractive">
          {`(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation?.type !== 'reload') return;

            if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
            if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
            window.scrollTo(0, 0);
          })();`}
        </Script>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
