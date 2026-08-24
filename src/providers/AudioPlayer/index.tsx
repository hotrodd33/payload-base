'use client'

import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { getEpisodeAudioUrl } from '@/utilities/getEpisodeAudioUrl'
import canUseDOM from '@/utilities/canUseDOM'
import type { PlayableEpisode } from './types'

const VOLUME_STORAGE_KEY = 'audio-player-volume'

const getStoredVolume = (): number => {
  if (!canUseDOM) return 1

  const stored = Number(window.localStorage.getItem(VOLUME_STORAGE_KEY))
  return Number.isFinite(stored) && stored >= 0 && stored <= 1 ? stored : 1
}

export interface AudioPlayerContextType {
  /** The episode currently loaded into the player (may be paused). */
  episode: PlayableEpisode | null
  isPlaying: boolean
  currentTime: number
  duration: number
  /** Loads (if needed) and plays the given episode. Switches tracks if a different episode is already loaded. */
  playEpisode: (episode: PlayableEpisode) => void
  /** Loads an episode into the player without starting playback (e.g. to show the latest episode by default). */
  loadEpisode: (episode: PlayableEpisode) => void
  togglePlay: () => void
  seek: (time: number) => void
  skip: (seconds: number) => void
  /** Current volume, 0–1. */
  volume: number
  /** Sets the volume (0–1) and un-mutes if it was muted. */
  setVolume: (volume: number) => void
  isMuted: boolean
  toggleMute: () => void
  /** Whether the bar is expanded (true) or collapsed to a small floating button (false). */
  isOpen: boolean
  open: () => void
  close: () => void
  toggleOpen: () => void
  /** True once an episode has ever been loaded — used to decide whether to render the sticky bar at all. */
  hasLoadedEpisode: boolean
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null)

export const AudioPlayerProvider: React.FC<{
  children: React.ReactNode
  /** The most recently published episode, preloaded from the server so the sticky player has something to show/play by default. */
  initialEpisode?: PlayableEpisode | null
}> = ({ children, initialEpisode = null }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [episode, setEpisode] = useState<PlayableEpisode | null>(initialEpisode)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasLoadedEpisode, setHasLoadedEpisode] = useState(Boolean(initialEpisode))
  const [volume, setVolumeState] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  // Restore the visitor's last volume preference once we're on the client.
  useEffect(() => {
    setVolumeState(getStoredVolume())
  }, [])

  const src = episode ? getEpisodeAudioUrl(episode.audio) : null

  const playEpisode = useCallback(
    (nextEpisode: PlayableEpisode) => {
      const audio = audioRef.current
      const isSameEpisode = episode?.id === nextEpisode.id

      setEpisode(nextEpisode)
      setHasLoadedEpisode(true)
      setIsOpen(true)

      if (!audio) return

      if (isSameEpisode) {
        // Already loaded — just resume playback.
        void audio.play()
        return
      }

      // Switching tracks: reset progress, then play once the new src is ready.
      setCurrentTime(0)
      setDuration(0)

      // The <audio> element's `src` updates via React on the next render; wait a
      // tick so `load()` picks up the new source before we call `play()`.
      requestAnimationFrame(() => {
        audio.load()
        void audio.play()
      })
    },
    [episode],
  )

  const loadEpisode = useCallback(
    (nextEpisode: PlayableEpisode) => {
      // Never override an episode the visitor already has loaded/playing.
      if (episode) return

      setEpisode(nextEpisode)
      setHasLoadedEpisode(true)
    },
    [episode],
  )

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      void audio.play()
    } else {
      audio.pause()
    }
  }, [])

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current
      if (!audio) return

      audio.currentTime = Math.min(Math.max(time, 0), duration || Infinity)
      setCurrentTime(audio.currentTime)
    },
    [duration],
  )

  const skip = useCallback(
    (seconds: number) => {
      const audio = audioRef.current
      if (!audio) return

      seek(audio.currentTime + seconds)
    },
    [seek],
  )

  const setVolume = useCallback((nextVolume: number) => {
    const clamped = Math.min(Math.max(nextVolume, 0), 1)
    const audio = audioRef.current

    setVolumeState(clamped)
    setIsMuted(clamped === 0)

    if (audio) {
      audio.volume = clamped
      audio.muted = clamped === 0
    }

    if (canUseDOM) {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped))
    }
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current

    setIsMuted((prevMuted) => {
      const nextMuted = !prevMuted
      if (audio) audio.muted = nextMuted
      return nextMuted
    })
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), [])

  // Keep the <audio> element's volume/mute state in sync (e.g. on first mount).
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.muted = isMuted
  }, [volume, isMuted])

  // Keep the <audio> element's `src` in sync whenever the episode changes.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return

    if (audio.src !== src) {
      audio.src = src
    }
  }, [src])

  const value = useMemo<AudioPlayerContextType>(
    () => ({
      episode,
      isPlaying,
      currentTime,
      duration,
      playEpisode,
      loadEpisode,
      togglePlay,
      seek,
      skip,
      volume,
      setVolume,
      isMuted,
      toggleMute,
      isOpen,
      open,
      close,
      toggleOpen,
      hasLoadedEpisode,
    }),
    [
      episode,
      isPlaying,
      currentTime,
      duration,
      playEpisode,
      loadEpisode,
      togglePlay,
      seek,
      skip,
      volume,
      setVolume,
      isMuted,
      toggleMute,
      isOpen,
      open,
      close,
      toggleOpen,
      hasLoadedEpisode,
    ],
  )

  return (
    <AudioPlayerContext value={value}>
      {children}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        preload="metadata"
        ref={audioRef}
      />
    </AudioPlayerContext>
  )
}

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = use(AudioPlayerContext)

  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider')
  }

  return context
}
