import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact Filip Gačić',
  description: 'Send a message to Filip Gačić about QA and testing projects.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <main>
      <div className="section" style={{ paddingTop: '2rem' }}>
        <Link href="/" style={{ color: 'var(--text-muted)' }}>← Back to portfolio</Link>
      </div>
      <ContactForm />
      <Footer />
    </main>
  )
}
