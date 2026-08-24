import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { EpisodePlayButton } from '@/components/EpisodeCard/PlayButton'
import { formatDateTime } from '@/utilities/formatDateTime'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const episodes = await payload.find({
    collection: 'episodes',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return episodes.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function EpisodePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/podcast/' + decodedSlug
  const episode = await queryEpisodeBySlug({ slug: decodedSlug })

  if (!episode) return <PayloadRedirects url={url} />

  return (
    <article className="pb-16 pt-24">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="container mb-8">
        <div className="mx-auto flex max-w-[48rem] flex-col gap-6 md:flex-row">
          {episode.coverImage && typeof episode.coverImage === 'object' && (
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg md:w-48">
              <Media fill imgClassName="object-cover" resource={episode.coverImage} size="192px" />
            </div>
          )}

          <div className="flex flex-1 flex-col justify-center gap-2">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {episode.season && <span>Season {episode.season}</span>}
              {episode.episodeNumber && <span>Episode {episode.episodeNumber}</span>}
              {episode.publishedDate && (
                <time dateTime={episode.publishedDate}>
                  {formatDateTime(episode.publishedDate)}
                </time>
              )}
            </div>
            <h1 className="text-3xl font-medium md:text-4xl">{episode.title}</h1>

            <EpisodePlayButton
              className="mt-2 size-12"
              episode={{
                id: episode.id,
                slug: episode.slug,
                title: episode.title,
                coverImage: episode.coverImage,
                audio: episode.audio,
                duration: episode.duration,
              }}
            />
          </div>
        </div>
      </div>

      <div className="container">
        {episode.description && (
          <RichText
            className="mx-auto max-w-[48rem]"
            data={episode.description}
            enableGutter={false}
          />
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const episode = await queryEpisodeBySlug({ slug: decodedSlug })

  return generateMeta({ doc: episode })
}

const queryEpisodeBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'episodes',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
