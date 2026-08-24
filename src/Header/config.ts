import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    // Site-wide navigation is structural, not day-to-day content, so only Admins can change it.
    update: isAdmin,
  },
  admin: {
    group: 'Settings',
    description: 'Controls the links shown in the top site navigation.',
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
