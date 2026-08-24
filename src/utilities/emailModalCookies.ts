'use client'

/**
 * Minimal, dependency-free cookie helpers for the email collection modal.
 * These run entirely client-side (document.cookie) since the modal's
 * show/hide decision happens after hydration in the browser.
 */

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

export function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return

  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export const EMAIL_MODAL_DISMISSED_COOKIE = 'email-modal-dismissed'
export const EMAIL_MODAL_SUBMITTED_COOKIE = 'email-modal-submitted'

export const EMAIL_MODAL_DISMISSED_DAYS = 30
export const EMAIL_MODAL_SUBMITTED_DAYS = 365
