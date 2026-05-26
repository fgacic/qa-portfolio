import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { SITE_URL } from '@/lib/links'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const TITLE = 'Filip Gačić — QA Engineer'
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
      <body>{children}</body>
    </html>
  )
}
