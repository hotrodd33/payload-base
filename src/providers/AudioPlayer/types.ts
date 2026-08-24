import type { Episode, Media as MediaType } from '@/payload-types'

/**
 * Minimal shape of an Episode needed to play + display it in the sticky
 * player. Kept intentionally small so callers (archive cards, detail pages)
 * don't need to fetch/pass the entire Episode document.
 */
export type PlayableEpisode = Pick<
  Episode,
  'id' | 'slug' | 'title' | 'coverImage' | 'audio' | 'duration'
>

export type { MediaType }
