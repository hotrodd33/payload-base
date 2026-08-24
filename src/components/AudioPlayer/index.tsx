'use client'

import { Pause, Play, RotateCcw, RotateCw } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'
import { formatAudioTime } from './formatAudioTime'

export type AudioPlayerProps = {
  className?: string
  /** Shown above the progress bar, e.g. the episode title. Optional. */
  title?: string
  /** Playable URL — works the same whether it's an uploaded file or an external/S3 URL. */
  src: string
  /** Enables the ±15s skip buttons. Defaults to true. */
  showSkipButtons?: boolean
}

/**
 * A reusable, dependency-free audio player built on the native <audio> element.
 * Works identically for uploaded Media file URLs and external/S3 URLs, since
 * both resolve to a plain playable `src` string before reaching this component.
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  className,
  title,
  src,
  showSkipButtons = true,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Reset playback state whenever the source changes (e.g. navigating between episodes).
  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [src])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      void audio.play()
    } else {
      audio.pause()
    }
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration || Infinity)
  }

  const handleSeek: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const audio = audioRef.current
    if (!audio) return

    const value = Number(event.target.value)
    audio.currentTime = value
    setCurrentTime(value)
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!src) return null

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-card p-4',
        className,
      )}
    >
      {title && <span className="truncate text-sm font-medium text-card-foreground">{title}</span>}

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        preload="metadata"
        ref={audioRef}
        src={src}
      />

      <div className="flex items-center gap-3">
        {showSkipButtons && (
          <button
            aria-label="Skip back 15 seconds"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={() => skip(-15)}
            type="button"
          >
            <RotateCcw className="size-4" />
          </button>
        )}

        <button
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={togglePlay}
          type="button"
        >
          {isPlaying ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="ml-0.5 size-5 fill-current" />
          )}
        </button>

        {showSkipButtons && (
          <button
            aria-label="Skip forward 15 seconds"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={() => skip(15)}
            type="button"
          >
            <RotateCw className="size-4" />
          </button>
        )}

        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
          {formatAudioTime(currentTime)}
        </span>

        <input
          aria-label="Seek"
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
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

        <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">
          {formatAudioTime(duration)}
        </span>
      </div>
    </div>
  )
}
