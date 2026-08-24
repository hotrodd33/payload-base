import { NextResponse } from 'next/server'

/**
 * Minimal newsletter signup endpoint used by the footer's NewsletterForm.
 *
 * This just validates the email and logs it — swap in a real integration
 * (Mailchimp, ConvertKit, Klaviyo, a Payload collection, etc.) when ready.
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    // TODO: Replace with a real email service integration, e.g.:
    // await mailchimp.lists.addListMember(listId, { email_address: email, status: 'subscribed' })
    console.log(`[newsletter-signup] New subscriber: ${email}`)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
