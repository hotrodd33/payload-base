import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { EpisodeCard } from '@/components/EpisodeCard'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import PageClient from './page.client'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const episodes = await payload.find({
    collection: 'episodes',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-publishedDate',
    select: {
      title: true,
      slug: true,
      coverImage: true,
      publishedDate: true,
      duration: true,
      audio: true,
      meta: true,
    },
  })

  return (
    <div className="pb-24 pt-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose max-w-none dark:prose-invert">
          <h1>Podcast</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="episodes"
          currentPage={episodes.page}
          limit={12}
          totalDocs={episodes.totalDocs}
        />
      </div>

      <div className="container">
        <div className="grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8 xl:gap-x-8">
          {episodes.docs.map((episode) => (
            <div className="col-span-4" key={episode.id}>
              <EpisodeCard className="h-full" doc={episode} />
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        {episodes.totalPages > 1 && episodes.page && (
          <Pagination page={episodes.page} totalPages={episodes.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Podcast',
    alternates: {
      canonical: `${getServerSideURL()}/podcast`,
    },
  }
}
