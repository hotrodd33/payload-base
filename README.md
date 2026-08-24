# My CMS Site — Payload CMS 3 + Next.js Starter

A reusable, production-ready starter for building client websites — especially content and podcast-focused sites — on **Payload CMS 3** and **Next.js App Router**. Clone it, rename it, and you have a fully client-manageable CMS with episodes/podcasting, audio playback, SEO, email, and role-based admin access already wired up.

## Features

- 🎙️ **Episodes / podcast system** with flexible audio — upload a file or link an external URL (e.g. an existing S3-hosted MP3)
- 🎧 **Sticky audio player** that persists across page navigation, with play/pause + collapsed "now playing" indicator
- 🔒 **Affiliate-protected downloads** — gate premium/downloadable content behind access rules
- 🧱 **Block-based page builder** (Hero, CallToAction, Content, Media, Archive, Forms, FAQ, Testimonials, Sponsors, etc.)
- 🦶 **Flexible multi-column footer** with newsletter signup and social media icons, fully editable from the admin
- 📧 **Configurable email system** — switch between **SendGrid** and native **SMTP/Nodemailer** with one environment variable
- 📬 **Email capture modal** built on the native Payload Form Builder (time/scroll triggers, cookie-based dismiss/success logic, page targeting)
- 🔍 **SEO foundation** — meta fields, Open Graph image, sitemap, canonical URLs, `robots.txt`
- 🔁 **Redirects** collection for managing legacy/broken URL redirects
- 📝 **Drafts & Live Preview** on Pages, Posts, and Episodes, with on-demand ISR revalidation
- 🛡️ **Dynamic Roles & access control** — create custom roles (Admin, Editor, or anything else) with per-collection create/read/update/delete permissions, instead of a hardcoded role enum
- 🎨 **Branded error pages** (404, error boundary, global error boundary)
- ☁️ **S3-compatible storage** for media uploads (or local disk in development)

## Tech Stack

- [Payload CMS 3](https://payloadcms.com/) (Postgres adapter, Lexical rich text editor)
- [Next.js](https://nextjs.org/) App Router (React Server Components)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Postgres](https://www.postgresql.org/) (via `@payloadcms/db-postgres`, run locally with Docker Compose)
- TypeScript throughout, with types generated from your Payload config

## Requirements

- **Node.js** `^18.20.2` or `>=20.9.0`
- **pnpm** `^9 || ^10 || ^11`
- **Docker** (recommended, for local Postgres via `docker-compose.yml`) — or your own Postgres instance
- An S3-compatible bucket (optional in development; required in production if you want uploaded media stored off-disk)

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url> my-client-site
cd my-client-site
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example file and fill in the values you need:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) below for the full list.

### 4. Start the database

```bash
docker compose up -d
```

This starts a local Postgres instance matching `DATABASE_URI` in `.env.example` (port `5433`, to avoid clashing with any local Postgres install on `5432`).

### 5. Generate the admin import map

```bash
pnpm generate:importmap
```

Required once after a fresh clone/install, before your first `/admin` load — Payload's admin panel resolves custom/plugin client components (e.g. the S3 storage adapter's upload handler) through a generated `importMap.js`, and a fresh checkout won't have one yet. Skipping this step causes a `PayloadComponent not found in importMap` console error on `/admin`. You generally won't need to re-run it manually afterward — the dev server regenerates it automatically as your config changes.

### 6. Run the development server

```bash
pnpm dev
```

Visit `http://localhost:3000/admin` to log into the admin panel. On first run, Payload runs its `onInit` bootstrap and creates a default admin user — see [Troubleshooting](#troubleshooting) for the credentials — so you never have to fight with the `create-first-user` screen.

To load demo content (pages, posts, episodes, forms, etc.), run the seed script from the admin panel's **Seed** action (or trigger the seed endpoint directly — see [Scripts](#scripts)).

## Environment Variables

All variables are documented in `.env.example`. Grouped by concern:

### Core (required)

| Variable | Description |
| --- | --- |
| `DATABASE_URI` | Postgres connection string |
| `PAYLOAD_SECRET` | Long random string used to sign JWTs — required in every environment |
| `NEXT_PUBLIC_SERVER_URL` | Public base URL of the site (no trailing slash), used for CORS, absolute links, and canonical URLs |

### Optional / feature-specific

| Variable | Description |
| --- | --- |
| `CRON_SECRET` | Authenticates scheduled/cron-triggered jobs (e.g. scheduled publishing) |
| `PREVIEW_SECRET` | Validates Live Preview / draft preview requests |

### S3 / Media Storage (optional in development)

| Variable | Description |
| --- | --- |
| `S3_BUCKET` | Bucket name. Leave unset to use local disk storage (`public/media`) in development |
| `S3_ACCESS_KEY_ID` | AWS (or S3-compatible) access key |
| `S3_SECRET_ACCESS_KEY` | AWS (or S3-compatible) secret key |
| `S3_REGION` | Bucket region, e.g. `us-east-1` |
| `S3_ENDPOINT` | Optional — only needed for non-AWS S3-compatible providers (Cloudflare R2, MinIO, etc.) |

### Email (required if sending any system email — password resets, form submissions, etc.)

| Variable | Description |
| --- | --- |
| `EMAIL_PROVIDER` | `nodemailer` (default, native SMTP) or `sendgrid` |
| `EMAIL_FROM_NAME` | Display name used as the "from" on outgoing emails |
| `EMAIL_FROM_ADDRESS` | "From" email address |
| `SENDGRID_API_KEY` | Required only when `EMAIL_PROVIDER=sendgrid` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SECURE` | Required only when `EMAIL_PROVIDER=nodemailer`. Works with Gmail, Outlook, cPanel, and most standard SMTP providers |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js dev server (with Payload admin at `/admin`) |
| `pnpm build` | Generate the import map + types, then build for production |
| `pnpm start` | Start the production server (run `build` first) |
| `pnpm dev:prod` | Clean, build, and start — useful for testing a production build locally |
| `pnpm generate:types` | Manually regenerate `payload-types.ts` (rarely needed — dev/build already do this automatically) |
| `pnpm generate:importmap` | Regenerate the Payload admin import map (needed after adding custom admin components) |
| `pnpm payload` | Run any Payload CLI command (e.g. `pnpm payload migrate`, `pnpm payload migrate:create`) |
| `pnpm lint` / `pnpm lint:fix` | Lint (and auto-fix) the project |
| `pnpm test` | Run integration (Vitest) and e2e (Playwright) tests |
| `pnpm test:int` | Run integration tests only |
| `pnpm test:e2e` | Run Playwright e2e tests only |

**Seeding demo content:** the seed logic lives in `src/endpoints/seed/index.ts` and is triggered from the admin panel's dashboard "seed" action (`src/components/BeforeDashboard`). Seeding **clears and replaces** Pages, Posts, Episodes, Media, Roles, and Users — do not run it against a database with real client content.

## Project Structure

```txt
src/
├── access/            # Reusable access-control helpers (isAdmin, hasRolePermission, canAccessAdmin, ...)
├── app/
│   ├── (frontend)/     # Public-facing site routes (pages, posts, podcast, error boundaries)
│   └── (payload)/       # Payload's admin panel routes
├── blocks/             # Page-builder blocks (Hero, CTA, Content, Media, Archive, Form, Sponsors, ...)
├── collections/        # Payload collections: Pages, Posts, Episodes, Media, Categories, Users, Roles
├── components/         # Shared React components (AudioPlayer, Analytics, AdminBar, ...)
├── email/              # Email adapter + sendEmail() utility (SendGrid / Nodemailer)
├── endpoints/seed/      # Seed data + seeding logic
├── fields/             # Reusable field configs (e.g. defaultLexical editor config)
├── Footer/             # Footer global config + frontend component
├── Header/              # Header global config + frontend component
├── heros/               # Hero block variants
├── hooks/               # Collection/field hooks
├── migrations/          # Hand-written and generated Postgres migrations
├── plugins/             # Payload plugin configuration (SEO, redirects, search, form-builder, S3)
├── providers/           # React context providers (theme, audio player, etc.)
├── search/              # Search plugin config
├── SiteSettings/         # Site Settings global (logo, contact info, social links, email modal config)
├── utilities/            # Shared utilities (getURL, generateMeta, revalidation helpers)
└── payload.config.ts     # Main Payload configuration
```

## Key Concepts

### Episodes & audio

The **Episodes** collection supports two ways of providing audio: uploading a file directly (stored via the S3 storage adapter, or locally in development) or linking an external URL — useful when hundreds of existing episode MP3s already live in a bucket you don't want to re-upload. The frontend **sticky audio player** persists playback across page navigations and shows a compact "now playing" indicator (a pulsing/playing icon) when collapsed and actively playing, or a plain play button when paused.

### Roles & access control

Instead of a hardcoded `admin`/`editor` enum, `Users.role` is a `relationship` field to the **Roles** collection (`src/collections/Roles`). Each Role has:

- `isAdminRole` — grants unrestricted access to everything (bypasses per-collection permissions)
- `accessAdmin` — whether the role can log into `/admin` at all
- `permissions` — an array of `{ collection, create, read, update, delete }` rows, letting you scope any role to exactly the collections and actions it needs (e.g. an Editor role limited to Pages, Posts, and Media)

Access-control helpers in `src/access/` (`isAdmin`, `hasRolePermission`, `canAccessAdmin`, `getUserRole`) read from the resolved Role doc and are shared across all collections. Create new roles from **Admin → Roles** in the panel — no code changes required to add a new role.

### Email provider switching

`src/email/adapter.ts` reads `EMAIL_PROVIDER` at startup and configures Payload's email adapter accordingly (SendGrid API or SMTP via Nodemailer). All application code — including system emails (password reset) and any custom email — should go through the shared `sendEmail()` helper in `src/email/`, so switching providers is a single environment variable change with no code edits.

### Footer & email capture modal configuration

The **Footer** global supports an arbitrary number of link columns (each with an optional title and an array of label + URL/internal-page links), a newsletter signup section (heading, description, enable toggle), and a social links array (platform + URL) rendered as icons — all editable from **Globals → Footer** in the admin, no developer needed for day-to-day content changes.

The **email capture modal** (configured under **Globals → Site Settings**) uses the native Payload Form Builder — pick an existing Form, set a time-delay or scroll-percentage trigger, choose which pages it appears on, and customize the headline/description/success message. Dismissals are remembered for 30 days; successful submissions for 1 year, via cookies.

## Deployment Notes

- Works well on **Vercel** or any Node-compatible host that supports Next.js App Router.
- Set all required environment variables (see above) in your hosting provider's dashboard — never commit `.env`.
- Run `pnpm payload migrate` against your production database before or during deploy (Payload does **not** auto-push schema changes outside of local dev mode).
- Configure S3 (or an S3-compatible bucket) in production — local disk storage is for development only and won't persist on most hosting platforms.
- Set `NEXT_PUBLIC_SERVER_URL` to your real production domain — it's used for CORS, canonical URLs, sitemap generation, and absolute links.
- If using scheduled publishing or cron-triggered jobs, set `CRON_SECRET` and configure your host's cron/scheduler to hit the jobs endpoint with that secret.
- **For a full step-by-step Vercel + Neon deployment walkthrough** (Neon setup, environment variables, S3/CORS config, migrations, custom domains, and a post-deploy checklist), see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Creating a New Client Project

1. Clone/fork this repo into a new repository for the client.
2. Update `package.json` (`name`, `description`) and this README's title/description.
3. Replace seed content (`src/endpoints/seed/`) with client-appropriate demo content, or remove seeding entirely for a real launch.
4. Update the **Site Settings** global with the client's logo, contact info, and social links.
5. Review the **Roles** collection — keep the default Admin/Editor roles or tailor permissions to the client's team structure.
6. Point `DATABASE_URI` at a fresh database and run `pnpm payload migrate` to apply the schema.
7. Configure environment variables for the client's actual email provider and S3 bucket.
8. Remove or adapt any features the client doesn't need (e.g. the podcast/episodes system, if not applicable).

## Troubleshooting

**Console error: `PayloadComponent not found in importMap` (e.g. `@payloadcms/storage-s3/client#S3ClientUploadHandler`) when opening `/admin`.**
The admin import map hasn't been generated yet — this happens on a fresh clone before the dev server has had a chance to build it. Run `pnpm generate:importmap`, then restart `pnpm dev` and reload `/admin`. See [Getting Started, step 5](#5-generate-the-admin-import-map).

**Can't get past the `/admin/create-first-user` screen (Role dropdown hangs).**
The app's `onInit` hook (`src/payload.config.ts`) automatically creates a default admin account on first startup so this screen never needs to be used:

```txt
email:    admin@admin.com
password: admin
```

Log in directly at `/admin/login`, then immediately create your real admin account and delete/rotate the default one. This hook is a no-op once any user exists, so it's safe to leave in place.

**Migrations hang with no output.**
Stop any running dev server before running `pnpm payload migrate` — Payload's dev server can hold open Postgres connections/locks that block schema migrations. Run migrations with the dev server stopped, then restart it afterward.

**`payload migrate:create` seems to hang or ignore my input.**
Its interactive enum-rename prompts don't handle piped/non-interactive input reliably in some terminals. If this happens, write the migration file by hand following the existing pattern in `src/migrations/`, then register it in `src/migrations/index.ts` and run `pnpm payload migrate`.

**I lost all my content/users after a reseed.**
The seed script clears and replaces Pages, Posts, Episodes, Media, Roles, and Users. Never run seeding against a database containing real client data — use it only for fresh demo/dev environments.

**Uploaded media isn't showing up in production.**
Confirm your S3 environment variables are set — without `S3_BUCKET`, uploads fall back to local disk storage, which won't persist across deploys on most hosting platforms.

**Emails aren't sending.**
Double-check `EMAIL_PROVIDER` matches the credentials you've filled in (`SENDGRID_API_KEY` for `sendgrid`, the `SMTP_*` variables for `nodemailer`), and that outbound SMTP/API traffic isn't blocked by your host or firewall.
