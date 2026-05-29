import Hero from '@/components/Hero'
import About from '@/components/About'
import Work from '@/components/Work'
import AIWorkflow from '@/components/AIWorkflow'
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
      <AIWorkflow />
      <Skills />
      <TestingShowcase />
      <ContactForm />
      <Footer />
    </>
  )
}
