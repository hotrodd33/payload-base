import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  // Delete existing test user if any
  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  // Find (or create) an Admin role to assign to the test user
  const { docs: adminRoles } = await payload.find({
    collection: 'roles',
    where: {
      isAdminRole: {
        equals: true,
      },
    },
    limit: 1,
  })

  const adminRole =
    adminRoles[0] ??
    (await payload.create({
      collection: 'roles',
      data: {
        name: 'Admin',
        description: 'Full administrator access to all content, users, and settings.',
        accessAdmin: true,
        isAdminRole: true,
      },
    }))

  // Create fresh test user
  await payload.create({
    collection: 'users',
    data: {
      ...testUser,
      role: adminRole.id,
    },
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}
