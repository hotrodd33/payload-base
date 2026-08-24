import type { CollectionConfig, FieldAccess } from 'payload'

import { canAccessAdmin } from '../../access/canAccessAdmin'
import { getUserRole } from '../../access/getUserRole'
import { isAdmin } from '../../access/isAdmin'
import { isAdminOrSelf } from '../../access/isAdminOrSelf'

const isAdminFieldAccess: FieldAccess = async ({ req }) => {
  if (!req.user) return false
  const role = await getUserRole(req)
  return Boolean(role?.isAdminRole)
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: canAccessAdmin,
    // Only admins can create/delete users; editors may read/update their own record.
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: false,
      required: true,
      label: 'Role',
      access: {
        // Only admins can change a user's role.
        update: isAdminFieldAccess,
      },
      admin: {
        description:
          'Determines what this user can see and do in the admin panel. Manage available roles and their permissions under Admin → Roles.',
      },
      saveToJWT: true,
    },
  ],
  timestamps: true,
  versions: false,
}
