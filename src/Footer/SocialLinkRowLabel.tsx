'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

const platformLabels: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

export const SocialLinkRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['socialLinks']>[number]>()

  const label = data?.data?.platform
    ? platformLabels[data.data.platform] || data.data.platform
    : `Social Link ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}`

  return <div>{label}</div>
}
