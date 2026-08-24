import { NextResponse } from 'next/server'

import { sendEmail } from '@/utilities/sendEmail'

/**
 * Example endpoint demonstrating the provider-agnostic sendEmail() helper.
 * POST { "to": "someone@example.com" } to trigger a test email using whichever
 * provider is currently active (EMAIL_PROVIDER=sendgrid|nodemailer).
 */
export async function POST(req: Request) {
  const { to } = await req.json()

  if (!to) {
    return NextResponse.json({ error: 'Missing "to" address' }, { status: 400 })
  }

  await sendEmail({
    to,
    subject: 'Test email from My CMS Site',
    html: '<p>This is a test email sent via the provider-agnostic sendEmail() helper.</p>',
  })

  return NextResponse.json({ success: true })
}
