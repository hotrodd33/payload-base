import type { Access } from 'payload'

import { getUserRole } from './getUserRole'

type PermissionAction = 'create' | 'delete' | 'read' | 'update'

/**
 * Creates an Access function that checks the requesting user's Role for a
 * specific permission on the given collection. Roles with "Full administrator
 * access" always pass. Falls through to `false` for logged-out users.
 *
 * Usage:
 *   access: {
 *     create: hasRolePermission('pages', 'create'),
 *     read: hasRolePermission('pages', 'read'),
 *   }
 */
export const hasRolePermission = (
  collection: string,
  action: PermissionAction,
): Access => {
  return async ({ req }) => {
    if (!req.user) return false

    const role = await getUserRole(req)
    if (!role) return false
    if (role.isAdminRole) return true

    const permission = role.permissions?.find((row) => row.collection === collection)
    return Boolean(permission?.[action])
  }
}
