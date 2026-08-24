'use client'

import Link from 'next/link'
import React, { useCallback } from 'react'

import type { SponsorsBlock as SponsorsBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

type Sponsor = NonNullable<SponsorsBlockProps['sponsors']>[number]

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Appends any provided UTM parameters to the sponsor's destination URL without
 * clobbering existing query params. Falls back to naive string concatenation
 * if the URL isn't a valid absolute URL (e.g. a relative path).
 */
const buildTrackedUrl = (sponsor: Sponsor): string => {
  const { url, utmSource, utmMedium, utmCampaign, utmContent, utmTerm } = sponsor

  const utmParams: Record<string, string | null | undefined> = {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    utm_term: utmTerm,
  }

  const entries = Object.entries(utmParams).filter(([, value]) => Boolean(value)) as [
    string,
    string,
  ][]

  if (!url || entries.length === 0) return url || '#'

  try {
    const parsed = new URL(url)
    entries.forEach(([key, value]) => parsed.searchParams.set(key, value))
    return parsed.toString()
  } catch {
    const separator = url.includes('?') ? '&' : '?'
    const query = entries.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
    return `${url}${separator}${query}`
  }
}

const SponsorTile: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => {
  const { logo, name, newTab, trackingId } = sponsor
  const href = buildTrackedUrl(sponsor)

  const handleClick = useCallback(() => {
    const eventPayload = {
      sponsor_name: name,
      sponsor_id: trackingId || undefined,
      destination_url: href,
    }

    // Google Tag Manager
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: 'sponsor_click', ...eventPayload })
    }

    // gtag.js (Google Analytics 4)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'sponsor_click', eventPayload)
    }

    // Generic hook for any other analytics integration (Segment, custom, etc.)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sponsor:click', { detail: eventPayload }))
    }
  }, [href, name, trackingId])

  const newTabProps = newTab ? { rel: 'noopener noreferrer sponsored', target: '_blank' } : {}

  return (
    <Link
      className="flex items-center justify-center rounded-lg border border-border bg-card p-6 grayscale transition-all hover:grayscale-0"
      href={href}
      onClick={handleClick}
      {...newTabProps}
    >
      {logo && typeof logo === 'object' ? (
        <div className="relative h-12 w-full">
          <Media
            className="size-full"
            fill
            imgClassName="size-full object-contain"
            resource={logo}
            alt={name}
          />
        </div>
      ) : (
        <span className="text-sm font-medium">{name}</span>
      )}
    </Link>
  )
}

export const SponsorsBlock: React.FC<SponsorsBlockProps> = ({ heading, sponsors }) => {
  const hasSponsors = sponsors && sponsors.length > 0

  return (
    <div className="container">
      {heading && <h2 className="mb-8 text-center">{heading}</h2>}

      {hasSponsors && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sponsors.map((sponsor, index) => (
            <SponsorTile key={sponsor.id ?? index} sponsor={sponsor} />
          ))}
        </div>
      )}
    </div>
  )
}
