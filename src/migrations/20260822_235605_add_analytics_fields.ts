import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "analytics_google_tag_manager_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "analytics_disable_analytics_in_dev" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "analytics_google_tag_manager_id";
  ALTER TABLE "site_settings" DROP COLUMN "analytics_disable_analytics_in_dev";`)
}
