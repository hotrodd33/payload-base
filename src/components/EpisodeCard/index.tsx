import Link from 'next/link'
import React from 'react'

import type { Episode } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { formatDateTime } from '@/utilities/formatDateTime'
import { EpisodePlayButton } from './PlayButton'

export type CardEpisodeData = Pick<
  Episode,
  'id' | 'slug' | 'title' | 'coverImage' | 'publishedDate' | 'duration' | 'audio' | 'meta'
>

export const EpisodeCard: React.FC<{
  className?: string
  doc: CardEpisodeData
}> = ({ className, doc }) => {
  const { id, slug, title, coverImage, publishedDate, duration, audio, meta } = doc
  const description = meta?.description
  const href = `/podcast/${slug}`

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-card',
        className,
      )}
    >
      <Link className="relative block aspect-square w-full bg-muted" href={href}>
        {coverImage && typeof coverImage === 'object' ? (
          <Media
            fill
            imgClassName="object-cover"
            resource={coverImage}
            size="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No cover image
          </div>
        )}

        <EpisodePlayButton
          className="absolute bottom-3 right-3"
          episode={{ id, slug, title, coverImage, audio, duration }}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {publishedDate && <time dateTime={publishedDate}>{formatDateTime(publishedDate)}</time>}
          {publishedDate && duration && <span aria-hidden>&middot;</span>}
          {duration && <span>{duration}</span>}
        </div>

        <h3 className="text-lg font-medium leading-snug">
          <Link className="hover:underline" href={href}>
            {title}
          </Link>
        </h3>

        {description && (
          <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </article>
  )
}
