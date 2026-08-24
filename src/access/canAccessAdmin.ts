import type { PayloadRequest } from 'payload'

import { getUserRole } from './getUserRole'

/**
 * Controls whether a logged-in user can access the /admin panel at all.
 * Respects each Role's "Can log into the admin panel" toggle.
 */
export const canAccessAdmin = async ({ req }: { req: PayloadRequest }): Promise<boolean> => {
  if (!req.user) return false

  const role = await getUserRole(req)
  if (!role) return false

  return role.isAdminRole || Boolean(role.accessAdmin)
}
