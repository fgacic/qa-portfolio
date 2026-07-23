import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export interface ContactNotificationProps {
  name: string
  email: string
  message: string
  id: string
}

export default function ContactNotification({
  name,
  email,
  message,
  id,
}: ContactNotificationProps) {
  const replyHref = `mailto:${email}?subject=${encodeURIComponent('Re: your message via fgacic.com')}`

  return (
    <Html>
      <Head />
      <Preview>{`New contact from ${name}: ${message.slice(0, 80)}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>fgacic.com</Text>
            <Heading style={h1}>New contact form submission</Heading>
          </Section>

          <Section style={card}>
            <Row label="From" value={name} />
            <Row label="Email" value={email} mono />
            <Row label="Submission ID" value={id} mono small />
          </Section>

          <Section style={messageSection}>
            <Text style={messageLabel}>Message</Text>
            <Text style={messageBody}>{message}</Text>
          </Section>

          <Section style={{ textAlign: 'center', marginTop: 32 }}>
            <Button href={replyHref} style={button}>
              Reply to {name}
            </Button>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Sent automatically by the contact form on fgacic.com. Reply to this email to respond
            to {name} directly.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

function Row({
  label,
  value,
  mono,
  small,
}: {
  label: string
  value: string
  mono?: boolean
  small?: boolean
}) {
  return (
    <table cellPadding={0} cellSpacing={0} style={rowTable}>
      <tbody>
        <tr>
          <td style={rowLabelCell}>{label}</td>
          <td
            style={{
              ...rowValueCell,
              fontFamily: mono
                ? 'ui-monospace, SFMono-Regular, Menlo, monospace'
                : rowValueCell.fontFamily,
              fontSize: small ? 12 : rowValueCell.fontSize,
              color: small ? '#6b7280' : rowValueCell.color,
            }}
          >
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#0b0d10',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: '32px 0',
}

const container: React.CSSProperties = {
  maxWidth: 560,
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: '32px',
  border: '1px solid #e5e7eb',
}

const header: React.CSSProperties = {
  paddingBottom: 16,
  borderBottom: '1px solid #f3f4f6',
  marginBottom: 24,
}

const brand: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#6b7280',
  margin: 0,
}

const h1: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: '#111827',
  margin: '8px 0 0',
  lineHeight: 1.3,
}

const card: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  borderRadius: 8,
  padding: '16px 20px',
  marginBottom: 24,
}

const rowTable: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

const rowLabelCell: React.CSSProperties = {
  fontSize: 13,
  color: '#6b7280',
  padding: '6px 16px 6px 0',
  verticalAlign: 'baseline',
  whiteSpace: 'nowrap',
  width: '1%',
}

const rowValueCell: React.CSSProperties = {
  fontSize: 14,
  color: '#111827',
  fontWeight: 500,
  padding: '6px 0',
  textAlign: 'right',
  verticalAlign: 'baseline',
  wordBreak: 'break-word',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const messageSection: React.CSSProperties = {
  marginTop: 8,
}

const messageLabel: React.CSSProperties = {
  fontSize: 13,
  color: '#6b7280',
  margin: '0 0 8px',
}

const messageBody: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: '#111827',
  whiteSpace: 'pre-wrap',
  margin: 0,
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderLeft: '3px solid #6366f1',
  borderRadius: 4,
}

const button: React.CSSProperties = {
  backgroundColor: '#111827',
  color: '#ffffff',
  fontSize: 14,
  fontWeight: 500,
  padding: '12px 24px',
  borderRadius: 8,
  textDecoration: 'none',
  display: 'inline-block',
}

const hr: React.CSSProperties = {
  borderColor: '#f3f4f6',
  margin: '32px 0 16px',
}

const footer: React.CSSProperties = {
  fontSize: 12,
  color: '#9ca3af',
  textAlign: 'center',
  margin: 0,
  lineHeight: 1.5,
}
