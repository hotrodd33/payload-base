import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { linkGroup } from '@/fields/linkGroup'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    // Site-wide navigation is structural, not day-to-day content, so only Admins can change it.
    update: isAdmin,
  },
  admin: {
    group: 'Settings',
    description:
      'Controls everything shown in the site footer: link columns, the newsletter signup, social icons, and the copyright line.',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Footer Columns',
      labels: {
        singular: 'Column',
        plural: 'Columns',
      },
      admin: {
        initCollapsed: true,
        description:
          'Groups of links shown side-by-side in the footer, e.g. "Company", "Resources", "Legal". Add, remove, or drag to reorder columns.',
        components: {
          RowLabel: '@/Footer/ColumnRowLabel#ColumnRowLabel',
        },
      },
      maxRows: 8,
      fields: [
        {
          name: 'columnTitle',
          type: 'text',
          label: 'Column Title',
          admin: {
            description: 'Optional heading shown above this column\'s links, e.g. "Company". Leave blank for no heading.',
          },
        },
        linkGroup({
          appearances: false,
          overrides: {
            admin: {
              initCollapsed: true,
              description: 'Add each link in this column. Choose an internal page or paste a custom URL.',
            },
          },
        }),
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      label: 'Newsletter Signup',
      admin: {
        description: 'An email signup form shown in the footer.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show Newsletter Signup',
          defaultValue: false,
          admin: {
            description: 'Turn this on to display the newsletter signup form in the footer.',
          },
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          defaultValue: 'Subscribe to our newsletter',
          admin: {
            description: 'Title shown above the email input, e.g. "Subscribe to our newsletter."',
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'Optional short sentence explaining what subscribers will get.',
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      admin: {
        initCollapsed: true,
        description:
          'Icons linking to your social media profiles, shown in the footer. Add, remove, or reorder as needed.',
        components: {
          RowLabel: '@/Footer/SocialLinkRowLabel#SocialLinkRowLabel',
        },
      },
      maxRows: 10,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Platform',
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'X (Twitter)', value: 'x' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'TikTok', value: 'tiktok' },
              ],
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Profile URL',
              required: true,
              admin: {
                width: '50%',
                description: 'Full link to your profile, including https://',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: 'All rights reserved.',
      admin: {
        description:
          'Shown at the very bottom of the footer next to the current year and site name, e.g. "All rights reserved."',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
