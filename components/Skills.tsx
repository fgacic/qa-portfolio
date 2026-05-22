'use client'

import { motion } from 'motion/react'

const SKILLS = [
  { name: 'Playwright', category: 'E2E Testing', accent: '#a855f7' },
  { name: 'k6', category: 'Load & Performance', accent: '#38bdf8' },
  { name: 'Postman / Bruno', category: 'API Testing', accent: '#6366f1' },
  { name: 'TypeScript', category: 'Language', accent: '#818cf8' },
  { name: 'GitHub Actions', category: 'CI/CD', accent: '#a855f7' },
  { name: 'Docker', category: 'Infrastructure', accent: '#38bdf8' },
  { name: 'REST / GraphQL', category: 'Protocols', accent: '#6366f1' },
  { name: 'Allure Reports', category: 'Reporting', accent: '#818cf8' },
  { name: 'BrowserStack', category: 'Cross-browser Testing', accent: '#a855f7' },
  { name: 'Azure DevOps', category: 'CI/CD', accent: '#38bdf8' },
  { name: 'Percy', category: 'Visual Regression', accent: '#6366f1' },
  { name: 'Lighthouse', category: 'Performance / A11y', accent: '#818cf8' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Skills() {
  return (
    <section id="skills" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="section">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Toolkit
        </motion.p>

        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          What I test with
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                padding: '1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)',
                cursor: 'default',
              }}
            >
              {/* Accent dot */}
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: skill.accent,
                  boxShadow: `0 0 10px ${skill.accent}55`,
                  marginBottom: '0.75rem',
                }}
              />
              <div
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                  lineHeight: 1.3,
                  marginBottom: '0.3rem',
                }}
              >
                {skill.name}
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                }}
              >
                {skill.category}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
