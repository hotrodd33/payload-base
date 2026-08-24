'use client'

import { Pause, Play, RotateCcw, RotateCw, Volume1, Volume2, VolumeX, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import { useAudioPlayer } from '@/providers/AudioPlayer'
import { formatAudioTime } from '@/components/AudioPlayer/formatAudioTime'

/**
 * Persistent, fixed-to-the-bottom mini player. Lives once in the root layout
 * so it survives client-side navigation between pages. Renders nothing until
 * an episode has actually been loaded (i.e. the visitor pressed play once).
 * When collapsed, shows only a small floating round button to reopen it.
 */
export const StickyPlayer: React.FC = () => {
  const {
    episode,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    skip,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isOpen,
    close,
    toggleOpen,
    hasLoadedEpisode,
  } = useAudioPlayer()

  if (!hasLoadedEpisode || !episode) return null

  if (!isOpen) {
    return (
      <button
        aria-label={isPlaying ? `Now playing — ${episode.title}` : `Open player — ${episode.title}`}
        className="fixed bottom-4 right-4 z-50 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
        onClick={toggleOpen}
        type="button"
      >
        {isPlaying ? (
          <span className="flex h-4 items-end gap-0.5" aria-hidden>
            <span className="w-1 animate-[playing-bar_0.9s_ease-in-out_infinite] bg-current [animation-delay:-0.3s]" />
            <span className="w-1 animate-[playing-bar_0.9s_ease-in-out_infinite] bg-current [animation-delay:-0.15s]" />
            <span className="w-1 animate-[playing-bar_0.9s_ease-in-out_infinite] bg-current" />
          </span>
        ) : (
          <Play className="ml-0.5 size-5 fill-current" />
        )}
      </button>
    )
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const effectiveVolume = isMuted ? 0 : volume
  const volumePercent = effectiveVolume * 100

  const handleSeek: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    seek(Number(event.target.value))
  }

  const handleVolumeChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setVolume(Number(event.target.value))
  }

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      data-sticky-player
    >
      <input
        aria-label="Seek"
        className="h-1 w-full cursor-pointer appearance-none bg-muted accent-primary"
        max={duration || 0}
        min={0}
        onChange={handleSeek}
        step={0.1}
        style={{
          background: `linear-gradient(to right, var(--color-primary) ${progressPercent}%, var(--color-muted) ${progressPercent}%)`,
        }}
        type="range"
        value={currentTime}
      />

      <div className="container flex items-center gap-3 py-2 md:gap-4 md:py-3">
        <Link
          className="relative hidden size-12 shrink-0 overflow-hidden rounded-md bg-muted sm:block md:size-14"
          href={`/podcast/${episode.slug}`}
        >
          {episode.coverImage && typeof episode.coverImage === 'object' && (
            <Media fill imgClassName="object-cover" resource={episode.coverImage} size="56px" />
          )}
        </Link>

        <div className="min-w-0 flex-1 sm:flex-none sm:w-40 md:w-56">
          <Link className="block truncate text-sm font-medium hover:underline" href={`/podcast/${episode.slug}`}>
            {episode.title}
          </Link>
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center gap-2 md:gap-3">
          <button
            aria-label="Skip back 15 seconds"
            className="hidden size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:flex"
            onClick={() => skip(-15)}
            type="button"
          >
            <RotateCcw className="size-4" />
          </button>

          <button
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 md:size-11"
            onClick={togglePlay}
            type="button"
          >
            {isPlaying ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="ml-0.5 size-5 fill-current" />
            )}
          </button>

          <button
            aria-label="Skip forward 15 seconds"
            className="hidden size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:flex"
            onClick={() => skip(15)}
            type="button"
          >
            <RotateCw className="size-4" />
          </button>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex sm:w-40 md:w-56">
          <button
            aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={toggleMute}
            type="button"
          >
            <VolumeIcon className="size-4" />
          </button>

          <input
            aria-label="Volume"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            max={1}
            min={0}
            onChange={handleVolumeChange}
            step={0.01}
            style={{
              background: `linear-gradient(to right, var(--color-primary) ${volumePercent}%, var(--color-muted) ${volumePercent}%)`,
            }}
            type="range"
            value={effectiveVolume}
          />
        </div>

        <button
          aria-label="Close player"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={close}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
