import React from 'react'
import {
  Award,
  CheckCircle,
  Globe,
  Heart,
  Layers,
  Lightbulb,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  'check-circle': CheckCircle,
  globe: Globe,
  heart: Heart,
  layers: Layers,
  lightbulb: Lightbulb,
  rocket: Rocket,
  settings: Settings,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  'trending-up': TrendingUp,
  users: Users,
  zap: Zap,
}

const columnClasses: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 lg:grid-cols-3',
  '4': 'md:grid-cols-2 lg:grid-cols-4',
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  columns,
  description,
  features,
  heading,
}) => {
  const hasFeatures = features && features.length > 0
  const gridClass = columnClasses[columns ?? '3'] || columnClasses['3']

  return (
    <div className="container">
      {(heading || description) && (
        <div className="max-w-[48rem] mx-auto text-center mb-12">
          {heading && <h2 className="mb-4">{heading}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {hasFeatures && (
        <div className={cn('grid grid-cols-1 gap-8', gridClass)}>
          {features.map((feature, index) => {
            const { description: featureDescription, icon, image, mediaType, title } = feature
            const Icon = icon ? iconMap[icon] : undefined

            return (
              <div className="flex flex-col items-start gap-4" key={index}>
                {mediaType === 'image' && image && typeof image === 'object' ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    <Media
                      className="size-full"
                      fill
                      imgClassName="size-full object-cover"
                      resource={image}
                    />
                  </div>
                ) : Icon ? (
                  <div className="flex size-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <Icon className="size-6" />
                  </div>
                ) : null}

                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  {featureDescription && (
                    <p className="mt-2 text-muted-foreground">{featureDescription}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
