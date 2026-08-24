import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'testimonials',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Testimonial',
        plural: 'Testimonials',
      },
      minRows: 1,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'authorName',
              type: 'text',
              label: 'Author Name',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'authorRole',
              type: 'text',
              label: 'Role / Company',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'authorImage',
          type: 'upload',
          label: 'Author Photo (optional)',
          relationTo: 'media',
        },
      ],
    },
  ],
}
