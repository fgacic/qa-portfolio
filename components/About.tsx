'use client'

import { motion } from 'motion/react'

const STATS = [
  { value: '5+', label: 'Years in QA' },
  { value: '3', label: 'Test disciplines' },
  { value: '100%', label: 'Test-owned site' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function About() {
  return (
    <section id="about" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="section">
        <motion.p
          className="section-label"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          variants={fadeUp}
        >
          About
        </motion.p>

        <motion.h2
          className="section-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={1}
          variants={fadeUp}
        >
          I break things on purpose<br />so production doesn&apos;t.
        </motion.h2>

        <motion.p
          className="section-body"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={2}
          variants={fadeUp}
          style={{ marginBottom: '2.5rem' }}
        >
          QA Engineer with a focus on building automated quality gates that catch
          regressions before they reach users. I work across the full testing
          pyramid — from fast Playwright E2E suites to API contract tests and k6
          load scenarios — and I own the CI pipeline that runs them on every push.
        </motion.p>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={3 + i}
              variants={fadeUp}
            >
              <div
                style={{
                  fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(112deg, #f8f7ff, #a5b4fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  marginTop: '0.25rem',
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CV download CTA — controlled by NEXT_PUBLIC_ENABLE_DOWNLOAD_CV */}
        {process.env.NEXT_PUBLIC_ENABLE_DOWNLOAD_CV === 'true' && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            custom={6}
            variants={fadeUp}
          >
            <a
              href="/cv.pdf"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.4rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(165, 180, 252, 0.4)',
                color: '#a5b4fc',
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              Download CV
            </a>
          </motion.div>
        )}

      </div>
    </section>
  )
}
