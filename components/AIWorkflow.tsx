'use client'

import { motion, useReducedMotion } from 'motion/react'

const STEPS: {
  verb: string
  tool: string
  href: string
  linkLabel: string
  secondaryHref?: string
  secondaryLinkLabel?: string
  body: string
  accent: string
}[] = [
  {
    verb: 'Research',
    tool: 'Codex',
    href: 'https://openai.com/codex/',
    linkLabel: 'Explore Codex',
    body: 'Explore the codebase, connect ticket context to the implementation, and compare solution options. I review the findings and own the final decisions.',
    accent: '#a78bfa',
  },
  {
    verb: 'Gather context',
    tool: 'Azure DevOps MCP + Jira MCP',
    href: 'https://learn.microsoft.com/en-us/azure/devops/mcp-server/mcp-server-overview?view=azure-devops',
    linkLabel: 'Azure DevOps MCP',
    secondaryHref: 'https://atlassian.github.io/atlassian-mcp-server/',
    secondaryLinkLabel: 'Jira MCP',
    body: 'Pull requirements, acceptance criteria, comments, history, and linked work into one view. Faster context gathering supports investigation, solution planning, and routine ticket administration.',
    accent: '#f59e0b',
  },
  {
    verb: 'Generate',
    tool: 'Playwright MCP',
    href: 'https://github.com/microsoft/playwright-mcp',
    linkLabel: 'Playwright MCP',
    body: 'Draft Playwright specs and ticket scaffolding straight from intent. I then own, prune, and harden every line.',
    accent: '#ec4899',
  },
  {
    verb: 'Run',
    tool: 'Playwright CLI',
    href: 'https://playwright.dev/docs/test-cli',
    linkLabel: 'Playwright CLI',
    body: 'Execute the suite locally and in CI, with sharding, retries, traces, and a shareable HTML report on every run.',
    accent: '#34d399',
  },
  {
    verb: 'Review',
    tool: 'Claude Code (CLI)',
    href: 'https://claude.com/claude-code',
    linkLabel: 'Claude Code',
    body: 'A first-pass review on every change before mine, catching the obvious before it reaches a human reviewer.',
    accent: '#22d3ee',
  },
  {
    verb: 'Investigate',
    tool: 'Chrome DevTools MCP',
    href: 'https://github.com/ChromeDevTools/chrome-devtools-mcp',
    linkLabel: 'Chrome DevTools MCP',
    body: 'Drive a real browser to reproduce a failure, walk the DOM and network, and pin down the root cause.',
    accent: '#06b6d4',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stepVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function AIWorkflow() {
  const reduced = useReducedMotion()
  return (
    <section id="ai-workflow" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="section">
        <motion.p
          className="section-label"
          initial={reduced ? 'visible' : 'hidden'}
          whileInView={reduced ? undefined : 'visible'}
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          variants={fadeUp}
        >
          Workflow
        </motion.p>

        <motion.h2
          className="section-heading"
          initial={reduced ? 'visible' : 'hidden'}
          whileInView={reduced ? undefined : 'visible'}
          viewport={{ once: true, margin: '-60px' }}
          custom={1}
          variants={fadeUp}
        >
          How AI accelerates my QA
        </motion.h2>

        <motion.p
          className="section-body"
          initial={reduced ? 'visible' : 'hidden'}
          whileInView={reduced ? undefined : 'visible'}
          viewport={{ once: true, margin: '-60px' }}
          custom={2}
          variants={fadeUp}
          style={{ marginBottom: '2.5rem' }}
        >
          I treat frontier AI tooling the way I treat any test infrastructure:
          leverage, with a human owning the verdict. It sits inside my daily QA loop,
          not around it: gathering ticket context, exploring solutions, generating
          coverage, reviewing changes, and chasing down failures faster.
        </motion.p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.verb}
              custom={i}
              variants={stepVariants}
              initial={reduced ? 'visible' : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                display: 'block',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: step.accent,
                    boxShadow: `0 0 10px ${step.accent}55`,
                  }}
                />
                <span
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  {step.verb}
                </span>
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                  marginBottom: '0.5rem',
                }}
              >
                {step.tool}
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  lineHeight: 1.55,
                  color: 'var(--text-muted)',
                }}
              >
                {step.body}
              </div>
              <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.78rem', color: step.accent, textDecoration: 'none' }}
                >
                  {step.linkLabel} ↗
                </a>
                {step.secondaryHref && (
                  <a
                    href={step.secondaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.78rem', color: step.accent, textDecoration: 'none' }}
                  >
                    {step.secondaryLinkLabel} ↗
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={reduced ? 'visible' : 'hidden'}
          whileInView={reduced ? undefined : 'visible'}
          viewport={{ once: true, margin: '-60px' }}
          custom={5}
          variants={fadeUp}
          style={{
            fontSize: '0.9rem',
            lineHeight: 1.65,
            color: 'var(--text-muted)',
            borderLeft: '2px solid rgba(103, 232, 249, 0.4)',
            paddingLeft: '1rem',
            maxWidth: '48rem',
          }}
        >
          The Playwright suite and CI you&apos;re looking at were authored in exactly
          this loop: generated, reviewed, and triaged with these tools, then signed
          off by me.
        </motion.p>
      </div>
    </section>
  )
}
