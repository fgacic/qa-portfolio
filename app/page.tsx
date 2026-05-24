import Hero from '@/components/Hero'
import About from '@/components/About'
import Work from '@/components/Work'
import Skills from '@/components/Skills'
import TestingShowcase from '@/components/TestingShowcase'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import { PROJECTS } from '@/lib/projects'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work projects={PROJECTS} />
      <Skills />
      <TestingShowcase />
      <ContactForm />
      <Footer />
    </>
  )
}
