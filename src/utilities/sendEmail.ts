import { getPayload } from 'payload'

import config from '@payload-config'

export type SendEmailArgs = {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  cc?: string | string[]
  bcc?: string | string[]
  /** Overrides the configured default from-address, e.g. `"Support <support@example.com>"` */
  from?: string
}

/**
 * Reusable helper for sending a one-off email from application code (API routes, hooks,
 * server actions, etc). It always goes through Payload's configured `email` adapter, so it
 * automatically uses whichever provider is selected via `EMAIL_PROVIDER` (SendGrid or SMTP) —
 * calling code never needs to know or care which one is active.
 *
 * @example
 * await sendEmail({
 *   to: 'client@example.com',
 *   subject: 'Thanks for reaching out!',
 *   html: '<p>We received your message and will reply within 1 business day.</p>',
 * })
 */
export async function sendEmail({ to, subject, html, text, cc, bcc, from }: SendEmailArgs) {
  const payload = await getPayload({ config })

  return payload.sendEmail({
    to,
    cc,
    bcc,
    from,
    subject,
    html,
    text,
  })
}
