import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Episodes } from './collections/Episodes'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Roles } from './collections/Roles'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './SiteSettings/config'
import { emailAdapter } from './email/adapter'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  collections: [Pages, Posts, Media, Categories, Episodes, Users, Roles],
  cors: [getServerSideURL()].filter(Boolean),
  email: emailAdapter,
  globals: [Header, Footer, SiteSettings],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
  onInit: async (payload) => {
    // Bootstrap a default admin so the create-first-user screen never has to
    // be used. Safe to leave in — it's a strict no-op once any user exists.
    const { totalDocs: userCount } = await payload.count({ collection: 'users' })
    if (userCount > 0) return

    const { docs: adminRoles } = await payload.find({
      collection: 'roles',
      where: { isAdminRole: { equals: true } },
      limit: 1,
    })

    let adminRole = adminRoles[0]

    if (!adminRole) {
      adminRole = await payload.create({
        collection: 'roles',
        data: {
          name: 'Admin',
          description: 'Full administrator access.',
          accessAdmin: true,
          isAdminRole: true,
        },
      })
    }

    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@admin.com',
        password: 'admin',
        role: adminRole.id,
      },
    })

    payload.logger.info(
      'Created default admin user: admin@admin.com / admin — change this immediately after logging in.',
    )
  },
})
