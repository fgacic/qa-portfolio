'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'motion/react'
import type { Project } from '@/lib/projects'
import { preloadGlobeAssets } from '@/lib/globePreload'

const Globe = dynamic(() => import('./Globe'), { ssr: false })

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
}

const projectIdOf = (p: Project) =>
  p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const IDLE_BORDER = 'rgba(255,255,255,0.07)'
const IDLE_BG = 'rgba(255,255,255,0.025)'
const hoverBorder = (accent: string) => `${accent}40`
const hoverBg = (accent: string) => `${accent}08`

function projectCardSurface(accent: string, isHovered: boolean) {
  return {
    border: `1px solid ${isHovered ? hoverBorder(accent) : IDLE_BORDER}`,
    background: isHovered ? hoverBg(accent) : IDLE_BG,
  }
}

export default function Work({ projects }: { projects: Project[] }) {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)

  useEffect(() => {
    const run = () => preloadGlobeAssets()
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(run, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(run, 1500)
    return () => clearTimeout(id)
  }, [])

  const scrollToProject = (id: string) => {
    const el = document.getElementById(`project-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="work" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="section work-section">
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Work
        </motion.p>

        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Sites I&apos;ve helped ship
        </motion.h2>

        <motion.p
          className="section-body"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2.5rem' }}
        >
          A selection of products I&apos;ve contributed quality assurance to — across
          Web3, real estate, and enterprise engineering.
        </motion.p>

        <div className="work-grid">
          <div
            className="work-cards"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {projects.map((project, i) => {
              const id = projectIdOf(project)
              const isHovered = hoveredProjectId === id
              return (
                <motion.a
                  key={project.url}
                  id={`project-${id}`}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '1.5rem',
                    borderRadius: '0.875rem',
                    ...projectCardSurface(project.accent, isHovered),
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.25s, background 0.25s',
                  }}
                  onMouseEnter={() => setHoveredProjectId(id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  onFocus={() => setHoveredProjectId(id)}
                  onBlur={() => setHoveredProjectId(null)}
                >
                  {/* Left: content */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          color: 'var(--text)',
                          lineHeight: 1.2,
                        }}
                      >
                        {project.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 500,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: project.accent,
                          opacity: 0.8,
                        }}
                      >
                        {project.category}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: '0 0 0.875rem',
                        fontSize: '0.875rem',
                        lineHeight: 1.65,
                        color: 'var(--text-muted)',
                        maxWidth: '56rem',
                      }}
                    >
                      {project.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '0.35rem',
                            border: `1px solid ${project.accent}30`,
                            background: `${project.accent}0d`,
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            color: project.accent,
                            opacity: 0.85,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: domain + arrow */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '0.5rem',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.03em',
                        opacity: 0.6,
                        display: 'none', // shown via @media in responsive
                      }}
                      className="work-domain"
                    >
                      {project.displayUrl}
                    </span>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        color: project.accent,
                        opacity: 0.7,
                        lineHeight: 1,
                      }}
                    >
                      ↗
                    </span>
                  </div>
                </motion.a>
              )
            })}
          </div>

          <div className="work-globe">
            <Globe
              projects={projects}
              projectIdOf={projectIdOf}
              hoveredProjectId={hoveredProjectId}
              onCountryHover={setHoveredProjectId}
              onCountryClick={scrollToProject}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
