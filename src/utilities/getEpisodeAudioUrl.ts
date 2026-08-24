import type { Episode, Media } from '@/payload-types'

import { getMediaUrl } from './getMediaUrl'

/**
 * Resolves an Episode's `audio` group to a single playable URL, regardless of
 * whether the client chose to upload a new MP3 (stored as Media, in the same
 * S3 bucket as everything else) or link to an MP3 that already exists in S3 /
 * elsewhere via a plain URL.
 */
export const getEpisodeAudioUrl = (audio: Episode['audio'] | undefined): string | null => {
  if (!audio) return null

  if (audio.source === 'url') {
    return audio.url || null
  }

  const file = audio.file as Media | number | null | undefined

  if (file && typeof file === 'object') {
    return getMediaUrl(file.url, file.updatedAt) || null
  }

  return null
}
