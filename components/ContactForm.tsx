'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import isEmail from 'validator/lib/isEmail'

type Status = 'idle' | 'submitting' | 'success' | 'rateLimit' | 'error'

function validateFields(fields: { name: string; email: string; message: string }) {
  const errors: Record<string, string> = {}
  if (!fields.name.trim()) {
    errors.name = 'Name is required'
  } else if (fields.name.trim().length > 100) {
    errors.name = 'Name must be 100 characters or fewer'
  }
  if (!fields.email.trim()) {
    errors.email = 'Email is required'
  } else if (!isEmail(fields.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!fields.message.trim()) {
    errors.message = 'Message is required'
  } else if (fields.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  } else if (fields.message.trim().length > 500) {
    errors.message = 'Message must be 500 characters or fewer'
  }
  return errors
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(10,10,12,0.8)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.5rem',
  padding: '0.65rem 0.875rem',
  color: 'var(--text)',
  width: '100%',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    if (status !== 'success') return
    setToastVisible(true)
    const timer = setTimeout(() => setToastVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [status])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => { const next = { ...prev }; delete next[name]; return next })
    }
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
  }

  function handleFieldBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    handleBlur(e)
    const { name } = e.target
    const fieldErrors = validateFields(fields)
    setErrors(prev => {
      const next = { ...prev }
      if (fieldErrors[name]) next[name] = fieldErrors[name]
      else delete next[name]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const clientErrors = validateFields(fields)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      setStatus('idle')
      return
    }

    setStatus('submitting')
    setErrors({})

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      if (res.ok) {
        setStatus('success')
        setFields({ name: '', email: '', message: '' })
        setErrors({})
      } else if (res.status === 422) {
        const data = await res.json()
        const fieldErrors: Record<string, string> = {}
        for (const err of data.errors as { field: string; message: string }[]) {
          fieldErrors[err.field] = err.message
        }
        setErrors(fieldErrors)
        setStatus('idle')
      } else if (res.status === 429) {
        setStatus('rateLimit')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24, mass: 0.6 }}
            style={{
              position: 'fixed',
              top: '1.5rem',
              right: '1.5rem',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              minHeight: '4rem',
              padding: '1.125rem 1.5rem',
              borderRadius: '0.875rem',
              border: '1px solid rgba(52,211,153,0.55)',
              background: 'linear-gradient(135deg, rgba(16,30,24,0.96), rgba(10,10,12,0.96))',
              color: 'rgba(209,250,229,1)',
              fontSize: '0.975rem',
              fontWeight: 500,
              boxShadow: '0 18px 45px rgba(0,0,0,0.5), 0 0 0 1px rgba(52,211,153,0.15), 0 0 24px rgba(52,211,153,0.18)',
              backdropFilter: 'blur(8px)',
              maxWidth: 'calc(100vw - 3rem)',
              overflow: 'hidden',
            }}
          >
            <motion.span
              aria-hidden="true"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.25, 1] }}
              transition={{ duration: 0.5, times: [0, 0.65, 1], ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.75rem',
                height: '1.75rem',
                flexShrink: 0,
                borderRadius: '999px',
                background: 'rgba(52,211,153,0.18)',
                color: 'rgba(110,231,183,1)',
              }}
            >
              <motion.span
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 2.2 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.25 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '999px',
                  border: '2px solid rgba(110,231,183,0.7)',
                }}
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <motion.polyline
                  points="20 6 9 17 4 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
                />
              </svg>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Message sent — I&apos;ll get back to you soon.
            </motion.span>
            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: '2px',
                width: '100%',
                transformOrigin: 'left center',
                background: 'linear-gradient(90deg, rgba(110,231,183,0.9), rgba(52,211,153,0.4))',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="section-label">Contact</p>

          <h2 className="section-heading">Get in touch</h2>

          <p className="section-body" style={{ marginBottom: '2rem' }}>
            Have a project in mind or want to talk QA? Send me a message.
          </p>

          {status === 'rateLimit' && (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(248,113,113,0.3)',
                background: 'rgba(248,113,113,0.08)',
                color: 'rgba(252,165,165,0.9)',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
              }}
            >
              Too many messages. Try again in an hour.
            </div>
          )}

          {status === 'error' && (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(248,113,113,0.3)',
                background: 'rgba(248,113,113,0.08)',
                color: 'rgba(252,165,165,0.9)',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
              }}
            >
              Something went wrong. Please try again.
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              padding: '2rem',
              borderRadius: '0.875rem',
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.025)',
              maxWidth: '40rem',
            }}
          >
            {/* Name */}
            <div>
              <label
                htmlFor="contact-name"
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={fields.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFieldBlur}
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)',
                }}
                autoComplete="name"
              />
              {errors.name && (
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'rgba(248,113,113,0.9)' }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFieldBlur}
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)',
                }}
                autoComplete="email"
              />
              {errors.email && (
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'rgba(248,113,113,0.9)' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                maxLength={500}
                value={fields.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFieldBlur}
                style={{
                  ...inputStyle,
                  minHeight: '100px',
                  resize: 'vertical',
                  borderColor: errors.message ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)',
                }}
              />
              <p
                style={{
                  margin: '0.25rem 0 0',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  opacity: 0.6,
                  textAlign: 'right',
                }}
              >
                {fields.message.length} / 500
              </p>
              {errors.message && (
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'rgba(248,113,113,0.9)' }}>
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.4rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(129, 140, 248, 0.35)',
                  background: status === 'submitting' ? 'rgba(99,102,241,0.05)' : 'rgba(99, 102, 241, 0.08)',
                  color: 'rgba(199, 210, 254, 0.9)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                  opacity: status === 'submitting' ? 0.7 : 1,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (status === 'submitting') return
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(129,140,248,0.6)'
                  el.style.background = 'rgba(99,102,241,0.14)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(129,140,248,0.35)'
                  el.style.background = 'rgba(99,102,241,0.08)'
                }}
              >
                {status === 'submitting' ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
