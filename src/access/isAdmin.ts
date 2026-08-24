import type { Access } from 'payload'

import { getUserRole } from './getUserRole'

/**
 * Grants access only to authenticated users whose Role has "Full
 * administrator access" enabled. Kept as `isAdmin` (rather than renaming
 * every call site to `isAdminRole`) since Site Settings, Header, and Footer
 * globals are intentionally admin-only regardless of collection permissions.
 */
export const isAdmin: Access = async ({ req }) => {
  if (!req.user) return false

  const role = await getUserRole(req)
  return Boolean(role?.isAdminRole)
}
