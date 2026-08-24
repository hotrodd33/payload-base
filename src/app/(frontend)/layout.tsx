import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Analytics, AnalyticsNoScript } from '@/components/Analytics'
import { EmailCollectionModal } from '@/components/EmailCollectionModal'
import { StickyPlayer } from '@/components/StickyPlayer'
import { StickyPlayerSpacer } from '@/components/StickyPlayer/Spacer'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { draftMode } from 'next/headers'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const payload = await getPayload({ config: configPromise })
  const { docs: latestEpisodes } = await payload.find({
    collection: 'episodes',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    sort: '-publishedDate',
    select: {
      title: true,
      slug: true,
      coverImage: true,
      duration: true,
      audio: true,
    },
  })
  const latestEpisode = latestEpisodes[0] ?? null

  const siteSettings = await getCachedGlobal('site-settings', 2)()
  const emailModalSettings = siteSettings?.emailCollectionModal

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <Analytics />
      </head>
      <body>
        <AnalyticsNoScript />
        <Providers initialEpisode={latestEpisode}>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          <StickyPlayerSpacer>
            {children}
            <Footer />
          </StickyPlayerSpacer>
          <StickyPlayer />
          {emailModalSettings?.enabled && <EmailCollectionModal settings={emailModalSettings} />}
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
