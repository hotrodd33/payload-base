import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Episode } from '../../../payload-types'

export const revalidateEpisode: CollectionAfterChangeHook<Episode> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/podcast/${doc.slug}`

      payload.logger.info(`Revalidating episode at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/podcast')
      revalidateTag('episodes-sitemap', 'max')
    }

    // If the episode was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/podcast/${previousDoc.slug}`

      payload.logger.info(`Revalidating old episode at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/podcast')
      revalidateTag('episodes-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Episode> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/podcast/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/podcast')
    revalidateTag('episodes-sitemap', 'max')
  }

  return doc
}
