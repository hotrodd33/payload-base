import React from 'react'

import { AudioPlayerProvider } from './AudioPlayer'
import type { PlayableEpisode } from './AudioPlayer/types'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
  initialEpisode?: PlayableEpisode | null
}> = ({ children, initialEpisode }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AudioPlayerProvider initialEpisode={initialEpisode}>{children}</AudioPlayerProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
