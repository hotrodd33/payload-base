import type { CollectionConfig } from 'payload'

import { isAdmin } from '../../access/isAdmin'
import { isAdminOrNoUsersExist } from '../../access/isAdminOrNoUsersExist'

// Collections a Role's permissions can be scoped to. Kept as a plain list
// (rather than deriving from payload.config at runtime) so the select options
// are available at config-build time.
export const MANAGEABLE_COLLECTIONS = [
  { label: 'Pages', value: 'pages' },
  { label: 'Posts', value: 'posts' },
  { label: 'Media', value: 'media' },
  { label: 'Episodes (Podcast)', value: 'episodes' },
  { label: 'Categories', value: 'categories' },
  { label: 'Users', value: 'users' },
] as const

export const Roles: CollectionConfig = {
  slug: 'roles',
  access: {
    // Only admin-level roles can manage roles themselves — this prevents an
    // Editor-level role from granting itself more access.
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrNoUsersExist,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'accessAdmin', 'isAdminRole'],
    description:
      'Define custom roles and choose exactly which collections each role can create, read, update, or delete. Assign a role to each user on the Users screen.',
    group: 'Admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'A short, recognizable name shown when assigning this role to a user, e.g. "Content Editor" or "Blog Contributor".',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional notes for other admins about who should have this role and why.',
      },
    },
    {
      name: 'accessAdmin',
      type: 'checkbox',
      label: 'Can log into the admin panel',
      defaultValue: true,
      admin: {
        description:
          'If disabled, users with this role cannot log into /admin at all — useful for roles that only need API access.',
      },
    },
    {
      name: 'isAdminRole',
      type: 'checkbox',
      label: 'Full administrator access',
      defaultValue: false,
      admin: {
        description:
          'Grants unrestricted access to every collection, global, and settings screen — including managing other Users and Roles. Only enable this for trusted administrators.',
      },
    },
    {
      name: 'permissions',
      type: 'array',
      label: 'Collection Permissions',
      admin: {
        description:
          'Add one row per collection this role should be able to access, and choose which actions are allowed. Ignored when "Full administrator access" is enabled above.',
        condition: (_, siblingData) => !siblingData?.isAdminRole,
      },
      fields: [
        {
          name: 'collection',
          type: 'select',
          required: true,
          options: [...MANAGEABLE_COLLECTIONS],
        },
        {
          name: 'create',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'read',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'update',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'delete',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
  timestamps: true,
}
