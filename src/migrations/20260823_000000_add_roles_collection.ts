import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Create the `roles` table and its `permissions` array sub-table.
  await db.execute(sql`
   CREATE TYPE "public"."enum_roles_permissions_collection" AS ENUM('pages', 'posts', 'media', 'episodes', 'categories', 'users');

   CREATE TABLE "roles" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "description" varchar,
    "access_admin" boolean DEFAULT true,
    "is_admin_role" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   CREATE TABLE "roles_permissions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "collection" "enum_roles_permissions_collection" NOT NULL,
    "create" boolean DEFAULT false,
    "read" boolean DEFAULT true,
    "update" boolean DEFAULT false,
    "delete" boolean DEFAULT false
   );

   ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;

   CREATE INDEX "roles_permissions_order_idx" ON "roles_permissions" USING btree ("_order");
   CREATE INDEX "roles_permissions_parent_id_idx" ON "roles_permissions" USING btree ("_parent_id");
   CREATE UNIQUE INDEX "roles_name_idx" ON "roles" USING btree ("name");
   CREATE INDEX "roles_updated_at_idx" ON "roles" USING btree ("updated_at");
   CREATE INDEX "roles_created_at_idx" ON "roles" USING btree ("created_at");
  `)

  // 2. Seed an Admin and Editor role for assignment going forward.
  const adminRole = await db.execute(
    sql`INSERT INTO "roles" ("name", "description", "access_admin", "is_admin_role") VALUES ('Admin', 'Full administrator access to all content, users, and settings.', true, true) RETURNING id;`,
  )
  const editorRole = await db.execute(
    sql`INSERT INTO "roles" ("name", "description", "access_admin", "is_admin_role") VALUES ('Editor', 'Can create and edit Pages, Posts, and Media. Cannot manage Users or Roles.', true, false) RETURNING id;`,
  )

  const editorRoleId = (editorRole.rows[0] as { id: number }).id

  await db.execute(sql`
   INSERT INTO "roles_permissions" ("_order", "_parent_id", "id", "collection", "create", "read", "update", "delete") VALUES
    (1, ${editorRoleId}, ${'editor-pages'}, 'pages', true, true, true, false),
    (2, ${editorRoleId}, ${'editor-posts'}, 'posts', true, true, true, false),
    (3, ${editorRoleId}, ${'editor-media'}, 'media', true, true, true, false);
  `)

  // 3. Add the `role_id` FK column on `users`. Note: the old `role` enum
  // column was already removed by a prior dev-mode schema push, so there is
  // no legacy data to backfill here — this only adds the new column/FK.
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "role_id" integer NOT NULL;
   ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;
   CREATE INDEX "users_role_idx" ON "users" USING btree ("role_id");
  `)

  // 4. Register `roles` in the polymorphic locked-documents rels table.
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "roles_id" integer;
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_roles_fk" FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
   CREATE INDEX "payload_locked_documents_rels_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("roles_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_roles_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "roles_id";

   ALTER TABLE "users" DROP CONSTRAINT "users_role_id_roles_id_fk";
   DROP INDEX "users_role_idx";
   ALTER TABLE "users" DROP COLUMN "role_id";

   DROP TABLE "roles_permissions" CASCADE;
   DROP TABLE "roles" CASCADE;
   DROP TYPE "public"."enum_roles_permissions_collection";
  `)
}

