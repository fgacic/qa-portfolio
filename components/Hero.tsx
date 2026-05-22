'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const TITLE = 'Filip Gačić'
const ROLE = 'QA Engineer'
const BIO = 'I break things on purpose so users don\'t have to — with Playwright and a lot of coffee.'

const REPULSION_RADIUS = 350
const MAX_PUSH = 240
const SPRING = { type: 'spring' as const, stiffness: 75, damping: 18, mass: 1 }
const BLOB_CLASSES = ['hero-blob hero-blob-a', 'hero-blob hero-blob-b', 'hero-blob hero-blob-c']

export default function Hero() {
  const reduced = useReducedMotion()
  const blobRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const homeCenters = useRef<{ x: number; y: number }[]>([])
  const [offsets, setOffsets] = useState([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

  useEffect(() => {
    homeCenters.current = blobRefs.current.map(el => {
      const r = el?.getBoundingClientRect()
      return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: 0, y: 0 }
    })
  }, [])

  useEffect(() => {
    if (reduced) return
    const onMove = (e: MouseEvent) => {
      setOffsets(
        homeCenters.current.map(home => {
          const dx = home.x - e.clientX
          const dy = home.y - e.clientY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < REPULSION_RADIUS && dist > 0) {
            const force = ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) * MAX_PUSH
            return { x: (dx / dist) * force, y: (dy / dist) * force }
          }
          return { x: 0, y: 0 }
        })
      )
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <section id="hero" className="hero-screen screen">
      <div className="hero-bg" aria-hidden>
        {BLOB_CLASSES.map((cls, i) => (
          <motion.div
            key={i}
            ref={el => { blobRefs.current[i] = el }}
            className={cls}
            animate={offsets[i]}
            transition={SPRING}
          />
        ))}
      </div>

      <motion.div
        className="hero-card"
        initial={{ opacity: 0, y: reduced ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="hero-name">{TITLE}</h1>
        <p className="hero-role">{ROLE}</p>
        <p className="hero-bio">{BIO}</p>

        <motion.a
          href="#about"
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduced ? 1 : 0.4 }}
          transition={{ delay: reduced ? 0 : 0.6, duration: 0.8 }}
          whileHover={{ opacity: 0.85 }}
          aria-label="Scroll to about section"
        >
          ↓ scroll
        </motion.a>
      </motion.div>
    </section>
  )
}
