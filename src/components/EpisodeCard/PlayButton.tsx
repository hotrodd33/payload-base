'use client'

import { Pause, Play } from 'lucide-react'
import React from 'react'

import { useAudioPlayer } from '@/providers/AudioPlayer'
import type { PlayableEpisode } from '@/providers/AudioPlayer/types'
import { cn } from '@/utilities/ui'

/**
 * Small play/pause button that hands the episode off to the persistent
 * sticky player. Works from the archive grid and the single episode page.
 */
export const EpisodePlayButton: React.FC<{
  className?: string
  episode: PlayableEpisode
}> = ({ className, episode }) => {
  const { episode: currentEpisode, isPlaying, playEpisode, togglePlay } = useAudioPlayer()

  const isCurrent = currentEpisode?.id === episode.id
  const showPause = isCurrent && isPlaying

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (isCurrent) {
      togglePlay()
    } else {
      playEpisode(episode)
    }
  }

  return (
    <button
      aria-label={showPause ? `Pause ${episode.title}` : `Play ${episode.title}`}
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90',
        className,
      )}
      onClick={handleClick}
      type="button"
    >
      {showPause ? (
        <Pause className="size-4 fill-current" />
      ) : (
        <Play className="ml-0.5 size-4 fill-current" />
      )}
    </button>
  )
}
