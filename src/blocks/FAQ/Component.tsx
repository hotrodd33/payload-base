import React from 'react'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import RichText from '@/components/RichText'

export const FAQBlock: React.FC<FAQBlockProps> = ({ heading, items }) => {
  const hasItems = items && items.length > 0

  return (
    <div className="container">
      <div className="max-w-[48rem] mx-auto">
        {heading && <h2 className="mb-8 text-center">{heading}</h2>}

        {hasItems && (
          <Accordion type="multiple">
            {items.map((item, index) => {
              const { question, answer } = item

              return (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>
                    {answer && <RichText data={answer} enableGutter={false} enableProse={false} />}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </div>
    </div>
  )
}
