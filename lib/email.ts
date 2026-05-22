import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('RESEND_API_KEY is not set — contact notifications will not work')
  } else {
    console.warn('[email] RESEND_API_KEY is not set — emails will not be sent in dev')
  }
}

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'filip.gacic98@gmail.com'
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'contact@fgacic.dev'

export async function sendContactNotification(params: {
  name: string
  email: string
  message: string
  id: string
}) {
  await resend.emails.send({
    from: `fgacic.dev <${FROM_EMAIL}>`,
    to: NOTIFY_EMAIL,
    subject: `New contact from ${params.name}`,
    text: [
      `Name: ${params.name}`,
      `Email: ${params.email}`,
      `ID: ${params.id}`,
      '',
      params.message,
    ].join('\n'),
  })
}
