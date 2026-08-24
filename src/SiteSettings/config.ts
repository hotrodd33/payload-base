import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    // Brand, contact and tracking settings apply site-wide, so only Admins can change them.
    update: isAdmin,
  },
  admin: {
    group: 'Settings',
    description:
      'Global site details used across the whole website: brand identity, contact info, social links, and analytics.',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Site Name',
      required: true,
      admin: {
        description: 'The name of your business or website, e.g. "Acme Co." Shown in browser tabs and shared links.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      admin: {
        description: 'A short phrase describing what you do, e.g. "Handmade furniture since 1995."',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      label: 'Site Logo',
      relationTo: 'media',
      admin: {
        description: 'Shown in the site header and footer. A wide, transparent PNG or SVG works best.',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      label: 'Favicon',
      relationTo: 'media',
      admin: {
        description: 'The small icon shown in browser tabs. Use a square image (e.g. 512x512px).',
      },
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      label: 'Default Social Share Image',
      relationTo: 'media',
      admin: {
        description:
          'Used as a fallback image when a Page or Post is shared on social media and has no image of its own set in its SEO tab.',
      },
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
        description: 'Links to your social media profiles, shown as icons in the site footer.',
      },
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
      maxRows: 10,
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Contact Email',
      admin: {
        description: 'Public email address shown in the footer and used for general inquiries.',
      },
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Contact Phone Number',
      admin: {
        description: 'Public phone number shown in the footer, e.g. "(555) 123-4567".',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Business Address',
      admin: {
        description: 'Your business or office address, shown in the footer.',
      },
    },
    {
      name: 'emailCollectionModal',
      type: 'group',
      label: 'Email Collection Modal (Popup)',
      admin: {
        description:
          'A popup that invites visitors to sign up using one of your existing Payload Forms. Enable it, pick a form, and choose when/where it should appear.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Popup Modal',
          defaultValue: false,
          admin: {
            description: 'Turn the popup on or off site-wide without deleting its content.',
          },
        },
        {
          type: 'row',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
          fields: [
            {
              name: 'triggerType',
              type: 'select',
              label: 'Show After',
              defaultValue: 'delay',
              options: [
                { label: 'Time Delay', value: 'delay' },
                { label: 'Scroll Percentage', value: 'scroll' },
              ],
              admin: {
                width: '50%',
                description: 'Choose whether the popup appears after a number of seconds, or after the visitor scrolls a percentage down the page.',
              },
            },
            {
              name: 'triggerValue',
              type: 'number',
              label: 'Trigger Value',
              defaultValue: 8,
              min: 0,
              admin: {
                width: '50%',
                description:
                  'Seconds to wait (e.g. 8) if "Time Delay" is selected, or the scroll percentage (e.g. 50 for halfway down the page) if "Scroll Percentage" is selected.',
              },
            },
          ],
        },
        {
          name: 'pageTargeting',
          type: 'select',
          label: 'Show On',
          defaultValue: 'all',
          options: [
            { label: 'All Pages', value: 'all' },
            { label: 'Homepage Only', value: 'homepage' },
            { label: 'Specific Pages', value: 'specific' },
          ],
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
            description: 'Control which pages the popup is allowed to appear on.',
          },
        },
        {
          name: 'specificPages',
          type: 'relationship',
          relationTo: 'pages',
          hasMany: true,
          label: 'Specific Pages',
          admin: {
            condition: (_, siblingData) =>
              Boolean(siblingData?.enabled) && siblingData?.pageTargeting === 'specific',
            description: 'Choose exactly which pages should show the popup.',
          },
        },
        {
          name: 'headline',
          type: 'text',
          label: 'Headline',
          defaultValue: 'Stay in the loop!',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
            description: 'The large heading shown at the top of the popup.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
            description: 'A short sentence or two explaining what visitors will get by signing up.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Optional Image',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
            description: 'Optional image or background shown alongside the headline and form.',
          },
        },
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          label: 'Form to Display',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
            description:
              'Select which existing Payload Form (built in the Forms collection) should be rendered inside the popup.',
          },
        },
        {
          name: 'successMessageOverride',
          type: 'textarea',
          label: 'Success Message Override',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
            description:
              'Optional: overrides the confirmation message configured on the Form itself. Leave blank to use the Form\'s own confirmation message.',
          },
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics & Tracking',
      admin: {
        description: 'Advanced: connect this site to Google Analytics/Tag Manager. Leave blank if unsure.',
      },
      fields: [
        {
          name: 'googleTagManagerId',
          type: 'text',
          label: 'Google Tag Manager ID',
          admin: {
            description:
              'Google Tag Manager container ID, e.g. GTM-XXXXXXX. Recommended: manage GA4 and other tags inside GTM rather than filling in both fields below.',
          },
        },
        {
          name: 'googleAnalyticsId',
          type: 'text',
          label: 'Google Analytics ID',
          admin: {
            description:
              'GA4 Measurement ID, e.g. G-XXXXXXXXXX. Only needed if you are NOT already sending GA4 via Google Tag Manager above.',
          },
        },
        {
          name: 'disableAnalyticsInDev',
          type: 'checkbox',
          label: 'Disable Analytics in Development',
          defaultValue: true,
          admin: {
            description: 'Skip loading GTM/GA scripts when running in development (NODE_ENV !== "production").',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  versions: false,
}
