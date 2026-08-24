import { Facebook, Instagram, Linkedin, Twitter, Youtube, Music2 } from 'lucide-react'
import React from 'react'

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'x' | 'youtube' | 'tiktok'

const platformIcons: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  x: Twitter,
  youtube: Youtube,
  // lucide-react has no dedicated TikTok icon; Music2 is used as a reasonable stand-in.
  tiktok: Music2,
}

const platformLabels: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

type SocialIconsProps = {
  className?: string
  links: Array<{ platform: SocialPlatform; url: string }>
}

export const SocialIcons: React.FC<SocialIconsProps> = ({ className, links }) => {
  if (!links || links.length === 0) return null

  return (
    <div className={className}>
      {links.map(({ platform, url }, i) => {
        const Icon = platformIcons[platform]
        const label = platformLabels[platform] || platform

        return (
          <a
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white"
            href={url}
            key={i}
            rel="noopener noreferrer"
            target="_blank"
            title={label}
          >
            {Icon ? <Icon className="h-4 w-4" /> : label.slice(0, 1)}
          </a>
        )
      })}
    </div>
  )
}
