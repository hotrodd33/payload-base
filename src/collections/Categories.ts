import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isAdmin } from '../access/isAdmin'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    // Categories are site-wide taxonomy shared across Pages and Posts, so only
    // Admins can create/change/remove them. Editors can still read them (e.g.
    // to assign an existing category to a post) via the `anyone` read access below.
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    description:
      'Shared tags used to organize Posts. Contact an Admin if you need a new category added.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Category Name',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
