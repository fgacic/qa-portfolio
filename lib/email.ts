import { Resend } from 'resend'
import ContactNotification from '@/emails/ContactNotification'

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'filip.gacic98@gmail.com'
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'contact@fgacic.com'

// Strip characters that would let a submitter inject extra email headers
// or break the From line. Collapses whitespace and caps length.
function sanitizeHeaderName(raw: string): string {
  return raw.replace(/[<>"\r\n\t]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80)
}

export async function sendContactNotification(params: {
  name: string
  email: string
  message: string
  id: string
}) {
  if (process.env.DISABLE_EMAIL === 'true' && process.env.NODE_ENV !== 'production') {
    console.warn('[email] DISABLE_EMAIL=true  -  skipping notification')
    return
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')

  const resend = new Resend(apiKey)
  const safeName = sanitizeHeaderName(params.name) || 'Contact form'

  const { error } = await resend.emails.send({
    from: `fgacic.com <${FROM_EMAIL}>`,
    to: NOTIFY_EMAIL,
    replyTo: params.email,
    subject: `New contact from ${safeName}`,
    react: ContactNotification({
      name: params.name,
      email: params.email,
      message: params.message,
      id: params.id,
    }),
    text: [
      `Name: ${params.name}`,
      `Email: ${params.email}`,
      `ID: ${params.id}`,
      '',
      params.message,
    ].join('\n'),
  })
  if (error) throw new Error(`Resend: ${error.message}`)
}
