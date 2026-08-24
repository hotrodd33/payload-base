import type { PayloadRequest } from 'payload'

import type { Role } from '@/payload-types'

/**
 * Resolves the full Role document for the given request's user, caching the
 * result on `req.context` for the lifetime of the request so multiple access
 * checks (e.g. create + read on the same request) only hit the DB once.
 */
export const getUserRole = async (req: PayloadRequest): Promise<Role | null> => {
  const user = req.user

  if (!user || !('role' in user) || !user.role) {
    return null
  }

  if (req.context?.resolvedRole) {
    return req.context.resolvedRole as Role
  }

  const roleId = typeof user.role === 'object' ? user.role.id : user.role

  const role = await req.payload.findByID({
    collection: 'roles',
    id: roleId,
    depth: 0,
    req,
  })

  if (req.context) {
    req.context.resolvedRole = role
  }

  return role ?? null
}
