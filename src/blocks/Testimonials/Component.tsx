import React from 'react'

import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  description,
  heading,
  testimonials,
}) => {
  const hasTestimonials = testimonials && testimonials.length > 0

  return (
    <div className="container">
      {(heading || description) && (
        <div className="max-w-[48rem] mx-auto text-center mb-12">
          {heading && <h2 className="mb-4">{heading}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {hasTestimonials && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => {
            const { authorImage, authorName, authorRole, quote } = testimonial

            return (
              <figure
                className="flex flex-col justify-between rounded-lg border border-border bg-card p-6"
                key={index}
              >
                <blockquote className="text-card-foreground">
                  <p>&ldquo;{quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {authorImage && typeof authorImage === 'object' && (
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                      <Media
                        className="size-full"
                        imgClassName="size-full object-cover"
                        fill
                        resource={authorImage}
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{authorName}</div>
                    {authorRole && (
                      <div className="text-sm text-muted-foreground">{authorRole}</div>
                    )}
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      )}
    </div>
  )
}
