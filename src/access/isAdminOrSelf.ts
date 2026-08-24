import type { Access } from 'payload'

import { getUserRole } from './getUserRole'

/**
 * Users whose Role has "Full administrator access" can manage all users.
 * Everyone else can only read/update their own user record.
 */
export const isAdminOrSelf: Access = async ({ req }) => {
  const { user } = req
  if (!user) return false

  const role = await getUserRole(req)
  if (role?.isAdminRole) return true

  return {
    id: {
      equals: user.id,
    },
  }
}
