import type { EmailAdapter, SendEmailOptions } from 'payload'

import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'

/**
 * Converts Payload's flexible `to`/`cc`/`bcc` shape (string | Address | array of either)
 * into a plain string address, since SendGrid's SDK expects `string | string[]`.
 */
const addressToString = (
  address: SendEmailOptions['to'] | SendEmailOptions['cc'] | SendEmailOptions['bcc'],
): string | string[] | undefined => {
  if (!address) return undefined

  const toStr = (a: string | { address?: string; name?: string }): string =>
    typeof a === 'string' ? a : (a.address ?? '')

  if (Array.isArray(address)) {
    return address.map(toStr).filter(Boolean)
  }

  return toStr(address)
}

/**
 * Builds Payload's `email` adapter based on the `EMAIL_PROVIDER` environment variable.
 *
 * - `EMAIL_PROVIDER=sendgrid`   -> sends via the SendGrid API (requires SENDGRID_API_KEY)
 * - `EMAIL_PROVIDER=nodemailer` -> sends via standard SMTP (requires SMTP_HOST/PORT/USER/PASS)
 *
 * Both providers are exposed to Payload (and to our own `sendEmail()` helper) through the
 * exact same `EmailAdapter` interface, so switching providers never requires touching any
 * calling code — only the environment variables change.
 */
export const emailAdapter: EmailAdapter = ({ payload }) => {
  const provider = process.env.EMAIL_PROVIDER || 'nodemailer'
  const defaultFromAddress = process.env.EMAIL_FROM_ADDRESS || 'no-reply@example.com'
  const defaultFromName = process.env.EMAIL_FROM_NAME || 'My CMS Site'

  if (provider === 'sendgrid') {
    if (!process.env.SENDGRID_API_KEY) {
      payload.logger.warn(
        'EMAIL_PROVIDER is set to "sendgrid" but SENDGRID_API_KEY is missing. Emails will fail to send.',
      )
    } else {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    }

    return {
      name: 'sendgrid',
      defaultFromAddress,
      defaultFromName,
      sendEmail: async (message) => {
        const from =
          typeof message.from === 'string'
            ? message.from
            : (message.from?.address ?? `${defaultFromName} <${defaultFromAddress}>`)

        const to = addressToString(message.to)
        if (!to) {
          throw new Error('sendEmail: a "to" address is required')
        }

        return sgMail.send({
          from,
          to,
          cc: addressToString(message.cc),
          bcc: addressToString(message.bcc),
          subject: message.subject || '',
          text: message.text ? String(message.text) : ' ',
          html: message.html ? String(message.html) : undefined,
        })
      },
    }
  }

  // Default: native SMTP via Nodemailer
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  })

  return {
    name: 'nodemailer',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      return transport.sendMail({
        ...message,
        from: message.from || `${defaultFromName} <${defaultFromAddress}>`,
      })
    },
  }
}
