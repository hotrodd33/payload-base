# Deployment Guide — Vercel + Neon

Step-by-step guide for deploying this Payload CMS 3 + Next.js starter to production using **Vercel** (hosting), **Neon** (Postgres), and **S3** (media storage).

## 1. Overview

- **Recommended stack:** Vercel (hosting) + Neon (serverless Postgres) + S3 or an S3-compatible bucket (media storage)
- **What gets deployed:** a single Next.js application — the public site and the Payload admin panel (`/admin`) both run from the same Vercel deployment; there is no separate backend to host
- **Email:** SendGrid or SMTP, selected via `EMAIL_PROVIDER` (see [Environment Variables](#5-environment-variables))

## 2. Prerequisites

- A [Vercel](https://vercel.com/) account with the repo pushed to GitHub (or GitLab/Bitbucket)
- A [Neon](https://neon.tech/) account
- An S3 bucket (AWS S3, Cloudflare R2, or another S3-compatible provider) ready to use
- A domain you control (optional, but recommended for production)

## 3. Neon Database Setup

1. Create a new project in the [Neon console](https://console.neon.tech/).
2. Once created, open the project's **Connection Details** panel.
3. Copy the **pooled** connection string (Neon labels this "Pooled connection" — it routes through PgBouncer, which is required for serverless/edge environments like Vercel that open many short-lived connections). It looks like:

   ```
   postgresql://<user>:<password>@<project>-pooler.<region>.aws.neon.tech/<database>?sslmode=require
   ```

4. Use this pooled string as `DATABASE_URI` in Vercel. Do **not** use the unpooled/direct connection string for the running app — reserve that only for one-off admin tasks (e.g. running migrations from your local machine) if you ever need a direct connection.
5. Neon's default branch (`main`) is fine for a single-environment deploy. If you want a staging environment, create a second Neon branch and point your Vercel Preview environment's `DATABASE_URI` at it.
6. No manual schema setup is needed here — Payload's migrations (run in [step 7](#7-deployment-steps)) create all tables.

## 4. Vercel Project Setup

1. In Vercel, click **Add New → Project** and import the GitHub repository.
2. **Framework Preset:** Vercel should auto-detect **Next.js** — leave it as-is.
3. **Root Directory:** leave as `.` unless this project lives in a subfolder of a monorepo, in which case set it to that subfolder.
4. **Build Command:** leave the default (`pnpm build` / `next build`, per `package.json`) — this project's `build` script already runs Payload's build steps (import map + types) before `next build`, and `postbuild` runs sitemap generation automatically.
5. **Install Command:** if Vercel doesn't auto-detect `pnpm`, set it explicitly to `pnpm install`.
6. **Output Directory:** leave as default (`.next`).
7. Don't click **Deploy** yet — add environment variables first (next section), otherwise the first build will fail or the app will start without a working database/email/storage config.

## 5. Environment Variables

Add these in **Vercel → Project → Settings → Environment Variables**. Set them for the **Production** environment (and Preview/Development too, if you use those, typically pointing at separate Neon branches/buckets).

### Database

| Variable | Production value |
| --- | --- |
| `DATABASE_URI` | Neon **pooled** connection string (see step 3) — different from your local `.env`, which typically points at a local/Docker Postgres instance |

### Payload core

| Variable | Notes |
| --- | --- |
| `PAYLOAD_SECRET` | Generate a new, long random value for production — **never reuse your local dev secret** |
| `CRON_SECRET` | Only needed if you use scheduled publishing / cron-triggered jobs |
| `PREVIEW_SECRET` | Used to validate Live Preview / draft preview requests |

### URLs

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | Your real production domain, no trailing slash (e.g. `https://www.example.com`). Used for CORS, canonical URLs, sitemap generation, and absolute links — this **must** differ from `http://localhost:3000` used locally |

### Storage (S3 / R2)

| Variable | Notes |
| --- | --- |
| `S3_BUCKET` | Required in production — without it, uploads fall back to local disk, which does **not** persist on Vercel's ephemeral filesystem |
| `S3_ACCESS_KEY_ID` | |
| `S3_SECRET_ACCESS_KEY` | |
| `S3_REGION` | e.g. `us-east-1` |
| `S3_ENDPOINT` | Only needed for non-AWS providers (Cloudflare R2, MinIO, etc.) |

### Email

| Variable | Notes |
| --- | --- |
| `EMAIL_PROVIDER` | `sendgrid` or `nodemailer` |
| `EMAIL_FROM_NAME` | |
| `EMAIL_FROM_ADDRESS` | Use an address on a domain you've verified with your provider |
| `SENDGRID_API_KEY` | Required only when `EMAIL_PROVIDER=sendgrid` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` | Required only when `EMAIL_PROVIDER=nodemailer` |

> **Tip:** keep a copy of your production env var values in a password manager or secrets vault — don't rely on Vercel's dashboard as your only record.

## 6. S3 / Media Configuration

- Create a dedicated bucket for this project (don't share buckets across unrelated apps/clients).
- **Block public ACLs** at the bucket level, but allow the storage adapter to serve files — this project's S3 plugin proxies media requests through Payload/Next.js rather than requiring public bucket ACLs, so you do **not** need to make the bucket public.
- **CORS:** if you ever serve media directly from the bucket URL (bypassing the Payload proxy) or upload directly from the browser, add a CORS rule allowing `GET`/`PUT` from your production domain. If all uploads go through the Payload admin/API (the default in this starter), CORS is typically not required.
- Double check the IAM user/key tied to `S3_ACCESS_KEY_ID` has at minimum `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, and `s3:ListBucket` on the target bucket.
- Confirm `S3_REGION` matches the bucket's actual region — a mismatch is a common source of upload failures.

## 7. Deployment Steps

1. **Connect the repo** and configure environment variables in Vercel as described above.
2. Click **Deploy**. Vercel runs `pnpm install`, then the `build` script (Payload build + `next build` + sitemap generation via `postbuild`).
3. **Run database migrations against Neon.** Migrations do not run automatically as part of the Vercel build — run them once, before or right after your first deploy, from your local machine (or CI) with `DATABASE_URI` pointed at Neon:

   ```bash
   DATABASE_URI="<your Neon pooled connection string>" pnpm payload migrate
   ```

   You can also temporarily add this as a one-off Vercel deploy hook / build step if you prefer not to run it locally, but running it locally against Neon is simplest and safest for a first deploy.
4. Once the deploy is live and migrations have run, visit `https://<your-vercel-domain>/admin`.
5. **Create the first admin user.** This project bootstraps a default admin automatically via an `onInit` hook in `payload.config.ts` (`admin@admin.com` / `admin`) the first time Payload starts with zero users in the database — this covers the case where the `/admin/create-first-user` UI is unreliable. Log in with those credentials, then **immediately** create your real admin account and delete or change the password on the default one.
6. If you want seed/demo content, trigger the seed action from the admin dashboard — **only do this on a fresh production database**, since seeding clears Pages, Posts, Episodes, Media, Roles, and Users.

## 8. Custom Domain

1. In Vercel, go to **Project → Settings → Domains** and add your domain (e.g. `www.example.com`).
2. Follow Vercel's instructions to add the required DNS records (typically a `CNAME` for a subdomain, or an `A`/`ALIAS` record for an apex domain) at your DNS provider.
3. Wait for the domain to show **Valid Configuration** in Vercel (SSL is provisioned automatically).
4. Update `NEXT_PUBLIC_SERVER_URL` in Vercel's environment variables to the final custom domain (e.g. `https://www.example.com`), then **redeploy** — this variable is baked in at build time for things like the sitemap and metadata, so a redeploy is required after changing it.
5. If you use email sending, form submissions, or CORS-sensitive integrations, double check they also reference the new domain where relevant (e.g. SendGrid sender verification, any allow-listed origins).

## 9. Post-Deploy Checklist

- [ ] **Admin access** — log into `/admin` with your real admin account (not the bootstrap default) and confirm you can view/edit Pages, Posts, Episodes, Media, and Roles.
- [ ] **Media uploads** — upload a test image in Media and confirm it appears both in the admin and on the live site, and that the file actually landed in your S3 bucket (not local disk).
- [ ] **Email sending** — trigger a password reset (or send a test email via the `sendEmail()` helper) and confirm delivery for your configured provider (SendGrid or SMTP).
- [ ] **Forms** — submit a test entry through the email capture modal and/or any Form Builder form, and confirm the submission appears under **Form Submissions** in the admin.
- [ ] **Protected/affiliate routes** — confirm affiliate-gated downloads correctly block anonymous/unauthorized users and allow access for the intended role.
- [ ] **Live Preview / drafts** — open a draft Page/Post/Episode and confirm Live Preview renders correctly against the production URL.
- [ ] **Sitemap & SEO** — check `https://<your-domain>/sitemap.xml` and `robots.txt` are reachable, and that a sample page's canonical URL and OG image resolve correctly.
- [ ] **Scheduled/cron jobs** (if used) — confirm any scheduled publish jobs fire correctly with `CRON_SECRET` configured on both Vercel and your scheduler.

## 10. Common Issues & Troubleshooting

**Build succeeds but the app can't connect to the database / times out.**
Make sure `DATABASE_URI` uses Neon's **pooled** connection string, not the direct one — Vercel's serverless functions open many concurrent short-lived connections, which will exhaust Neon's direct connection limit quickly. Also confirm `?sslmode=require` is present in the connection string.

**Migrations "already applied" or schema mismatch errors after a redeploy.**
Make sure you're running `pnpm payload migrate` (not `migrate:fresh`, which drops data) and that you're pointing at the same Neon database/branch every time. If you used Payload's dev-mode auto schema push locally against a database you later also ran migrations against, inspect the actual DB schema before assuming a clean slate — dev-mode push and migrations can conflict if pointed at the same database.

**Media uploads fail (403/timeout) in production.**
Check that `S3_BUCKET`, `S3_REGION`, and credentials are correct and that the IAM user has `PutObject`/`GetObject`/`ListBucket` permissions on that exact bucket. A region mismatch (`S3_REGION` not matching the bucket's actual region) is the most common cause.

**Emails aren't sending in production.**
Confirm `EMAIL_PROVIDER` matches the credentials you've set (SendGrid API key vs. SMTP host/user/pass), that your sending domain/address is verified with your provider, and that the recipient's email isn't landing in spam. For SMTP, confirm your host allows outbound traffic on the configured port (some hosts block 25 by default; 587 with STARTTLS is usually safest).

**Live Preview or on-demand revalidation isn't updating the live site.**
Confirm `PREVIEW_SECRET` matches between the Payload config and any preview/revalidation route handlers, and that `NEXT_PUBLIC_SERVER_URL` matches the actual deployed domain — a stale or mismatched URL will cause preview links and revalidation requests to target the wrong origin.

**Admin panel loads but assets/styles are missing.**
This usually indicates the build didn't complete the Payload-specific build steps. Confirm the `build` script (not a bare `next build`) is what Vercel is running, so the import map and types are generated before the Next.js build.
