import type { Access } from 'payload'

import { isAdmin } from './isAdmin'

/**
 * Allows reading Roles when logged in as an admin, OR when no Users exist
 * yet — this is required so the Roles dropdown can populate on the
 * `/admin/create-first-user` screen, which runs before any user (and
 * therefore any resolvable role) exists.
 */
export const isAdminOrNoUsersExist: Access = async (args) => {
  const { req } = args

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    req,
  })

  if (totalDocs === 0) {
    return true
  }

  return isAdmin(args)
}
