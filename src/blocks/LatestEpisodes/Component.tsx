import type { LatestEpisodesBlock as LatestEpisodesBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { EpisodeCard } from '@/components/EpisodeCard'

export const LatestEpisodesBlock: React.FC<
  LatestEpisodesBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, heading, limit: limitFromProps, featuredOnly } = props

  const limit = limitFromProps || 3

  const payload = await getPayload({ config: configPromise })

  const { docs: episodes } = await payload.find({
    collection: 'episodes',
    depth: 1,
    limit,
    overrideAccess: false,
    sort: '-publishedDate',
    where: featuredOnly
      ? {
          featured: { equals: true },
        }
      : undefined,
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

  if (!episodes?.length) return null

  return (
    <div className="container" id={`block-${id}`}>
      <div className="mb-8 flex items-center justify-between">
        {heading && <h2 className="text-2xl font-medium md:text-3xl">{heading}</h2>}
        <Link className="text-sm underline underline-offset-4" href="/podcast">
          View all episodes
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8">
        {episodes.map((episode) => (
          <div className="col-span-4" key={episode.id}>
            <EpisodeCard className="h-full" doc={episode} />
          </div>
        ))}
      </div>
    </div>
  )
}
