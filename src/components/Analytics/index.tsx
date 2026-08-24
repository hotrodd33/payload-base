import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { GoogleAnalytics } from './GoogleAnalytics'
import { GoogleTagManager, GoogleTagManagerNoScript } from './GoogleTagManager'

async function getAnalyticsSettings() {
  const siteSettings = await getCachedGlobal('site-settings', 0)()
  const analytics = siteSettings?.analytics

  const gtmId = analytics?.googleTagManagerId
  const gaId = analytics?.googleAnalyticsId
  const disableInDev = analytics?.disableAnalyticsInDev ?? true

  if (disableInDev && process.env.NODE_ENV !== 'production') {
    return { gaId: undefined, gtmId: undefined }
  }

  return { gaId, gtmId }
}

/**
 * Reads GTM/GA4 IDs from the SiteSettings global and renders the
 * corresponding <script> tags. Meant to be rendered in <head>.
 * Nothing renders if no IDs are configured, or in dev when
 * `disableAnalyticsInDev` (default true) is enabled.
 */
export async function Analytics() {
  const { gaId, gtmId } = await getAnalyticsSettings()

  if (!gtmId && !gaId) return null

  return (
    <>
      {gtmId && <GoogleTagManager containerId={gtmId} />}
      {/* If GTM is configured, prefer managing GA4 inside GTM instead of also loading gtag.js directly. */}
      {gaId && !gtmId && <GoogleAnalytics measurementId={gaId} />}
    </>
  )
}

/**
 * Renders the GTM `<noscript>` iframe fallback. Google recommends this be placed
 * immediately after the opening `<body>` tag.
 */
export async function AnalyticsNoScript() {
  const { gtmId } = await getAnalyticsSettings()

  if (!gtmId) return null

  return <GoogleTagManagerNoScript containerId={gtmId} />
}
