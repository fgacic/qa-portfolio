import { NextRequest } from 'next/server'
import isEmail from 'validator/lib/isEmail'
import { sendContactNotification } from '@/lib/email'

const TEST_SECRET = '1x0000000000000000000000000000000AA'

async function verifyTurnstile(token: unknown): Promise<boolean> {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) return false

  const secret = process.env.TURNSTILE_SECRET_KEY ||
    (process.env.NODE_ENV === 'development' ? TEST_SECRET : undefined)
  if (!secret) throw new Error('TURNSTILE_SECRET_KEY is not configured')
  if (process.env.NODE_ENV === 'production' && secret === TEST_SECRET) {
    throw new Error('Production cannot use a Turnstile test secret')
  }

  const form = new URLSearchParams({ secret, response: token })
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error(`Turnstile verification returned ${response.status}`)
  const result: { success?: boolean; action?: string } = await response.json()
  return result.success === true && (secret === TEST_SECRET || result.action === 'contact')
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return Response.json({ errors: [{ field: 'body', message: 'Invalid request body' }] }, { status: 422 })
  }
  const errors: { field: string; message: string }[] = []

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' })
  } else if (body.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must be 100 characters or fewer' })
  }

  if (!body.email || typeof body.email !== 'string' || !isEmail(body.email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required' })
  }

  if (!body.message || typeof body.message !== 'string' || body.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' })
  } else if (body.message.trim().length > 500) {
    errors.push({ field: 'message', message: 'Message must be 500 characters or fewer' })
  }

  if (errors.length > 0) return Response.json({ errors }, { status: 422 })

  try {
    if (!await verifyTurnstile(body.turnstileToken)) {
      return Response.json({ error: 'verification_failed' }, { status: 403 })
    }

    const id = crypto.randomUUID()
    await sendContactNotification({
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
      id,
    })
    return Response.json({ ok: true, id })
  } catch (error) {
    console.error('[contact] delivery failed:', error)
    return Response.json({ error: 'delivery_failed' }, { status: 503 })
  }
}
