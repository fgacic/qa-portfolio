import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Filip Gačić — QA Engineer',
  description:
    'QA Engineer portfolio showcasing end-to-end testing with Playwright, API testing, and load & performance testing with k6.',
  keywords: ['QA Engineer', 'Playwright', 'k6', 'E2E testing', 'API testing', 'performance testing'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  )
}
