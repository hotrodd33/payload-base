'use client'

import React from 'react'

import { useAudioPlayer } from '@/providers/AudioPlayer'
import { cn } from '@/utilities/ui'

/**
 * Wraps the page content and adds bottom padding whenever the sticky player
 * is visible, so the fixed player never covers the last bit of content.
 */
export const StickyPlayerSpacer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasLoadedEpisode, isOpen } = useAudioPlayer()

  return <div className={cn(hasLoadedEpisode && isOpen && 'pb-20 md:pb-24')}>{children}</div>
}
