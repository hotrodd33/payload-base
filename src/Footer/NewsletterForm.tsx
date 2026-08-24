'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'

type NewsletterFormProps = {
  className?: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ className }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) return

    setStatus('submitting')

    try {
      // TODO: Hook this up to a real email service provider (Mailchimp, ConvertKit,
      // Klaviyo, etc.) or a custom `/api/newsletter-signups` endpoint. For now this
      // just simulates a request so the form is usable out of the box.
      const response = await fetch('/api/newsletter-signup', {
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }).catch(() => null)

      if (!response || !response.ok) {
        throw new Error('Newsletter signup endpoint is not configured yet.')
      }

      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          aria-label="Email address"
          className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 sm:w-64"
          disabled={status === 'submitting'}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
        <Button disabled={status === 'submitting'} type="submit" variant="secondary">
          {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </div>
      {status === 'success' && (
        <p className="mt-2 text-sm text-white/70">Thanks for subscribing!</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-sm text-white/70">
          Sorry, something went wrong. Please try again later.
        </p>
      )}
    </form>
  )
}
