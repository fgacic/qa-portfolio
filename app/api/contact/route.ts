import { NextRequest } from 'next/server'
import { insertSubmission, getAllSubmissions, type Submission } from '@/lib/db'
import { checkRateLimit } from '@/lib/rateLimit'
import { sendContactNotification } from '@/lib/email'
import { requireCfAccess } from '@/lib/cfAccess'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  const body = await req.json().catch(() => ({}))
  const errors: { field: string; message: string }[] = []

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' })
  } else if (body.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must be 100 characters or fewer' })
  }

  if (!body.email || typeof body.email !== 'string' || !EMAIL_RE.test(body.email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required' })
  }

  if (!body.message || typeof body.message !== 'string' || body.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' })
  } else if (body.message.trim().length > 2000) {
    errors.push({ field: 'message', message: 'Message must be 2000 characters or fewer' })
  }

  if (errors.length > 0) {
    return Response.json({ errors }, { status: 422 })
  }

  const rl = checkRateLimit(ip, 3, 60 * 60 * 1000)
  if (!rl.allowed) {
    return Response.json({ error: 'rate_limit_exceeded', retryAfter: rl.retryAfter }, { status: 429 })
  }

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const submission: Omit<Submission, 'readAt' | 'deletedAt'> = {
    id, name: body.name.trim(), email: body.email.trim(),
    message: body.message.trim(), createdAt: new Date().toISOString(), ip,
  }

  insertSubmission(submission)

  sendContactNotification({ name: submission.name, email: submission.email, message: submission.message, id }).catch(
    (err) => console.error('[email] notification failed:', err)
  )

  return Response.json({ ok: true, id })
}

export async function GET(req: NextRequest) {
  const authResult = await requireCfAccess(req)
  if (authResult instanceof Response) return authResult
  const submissions = getAllSubmissions()
  return Response.json({ submissions })
}
