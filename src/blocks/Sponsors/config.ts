import type { Block, TextFieldValidation } from 'payload'

const validateUrl: TextFieldValidation = (value, { required }) => {
  if (!value) {
    return required ? 'Please enter a destination URL.' : true
  }

  try {
    new URL(value)
    return true
  } catch {
    return 'Please enter a full, valid URL, including https://'
  }
}

export const Sponsors: Block = {
  slug: 'sponsors',
  interfaceName: 'SponsorsBlock',
  labels: {
    singular: 'Sponsors',
    plural: 'Sponsors Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'sponsors',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Sponsor',
        plural: 'Sponsors',
      },
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Sponsor Name',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: true,
              label: 'Open in new tab',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'logo',
          type: 'upload',
          label: 'Logo',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Full destination URL, including https://',
          },
          label: 'Destination URL',
          required: true,
          validate: validateUrl,
        },
        {
          type: 'collapsible',
          label: 'Click Tracking & UTM Parameters',
          fields: [
            {
              name: 'trackingId',
              type: 'text',
              admin: {
                description:
                  'Optional custom identifier included in click-tracking events (e.g. a GA4/analytics event param) to identify this sponsor.',
              },
              label: 'Tracking / Sponsor ID',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'utmSource',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                  label: 'utm_source',
                },
                {
                  name: 'utmMedium',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                  defaultValue: 'sponsor',
                  label: 'utm_medium',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'utmCampaign',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                  label: 'utm_campaign',
                },
                {
                  name: 'utmContent',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                  label: 'utm_content',
                },
              ],
            },
            {
              name: 'utmTerm',
              type: 'text',
              label: 'utm_term',
            },
          ],
        },
      ],
    },
  ],
}
