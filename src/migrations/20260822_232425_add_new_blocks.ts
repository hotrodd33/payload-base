import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_features_features_media_type" AS ENUM('icon', 'image');
  CREATE TYPE "public"."enum_pages_blocks_features_features_icon" AS ENUM('zap', 'shield', 'rocket', 'star', 'heart', 'check-circle', 'globe', 'trending-up', 'users', 'award', 'lightbulb', 'settings', 'sparkles', 'layers');
  CREATE TYPE "public"."enum_pages_blocks_features_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_features_features_media_type" AS ENUM('icon', 'image');
  CREATE TYPE "public"."enum__pages_v_blocks_features_features_icon" AS ENUM('zap', 'shield', 'rocket', 'star', 'heart', 'check-circle', 'globe', 'trending-up', 'users', 'award', 'lightbulb', 'settings', 'sparkles', 'layers');
  CREATE TYPE "public"."enum__pages_v_blocks_features_columns" AS ENUM('2', '3', '4');
  CREATE TABLE "pages_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_role" varchar,
  	"author_image_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_type" "enum_pages_blocks_features_features_media_type" DEFAULT 'icon',
  	"icon" "enum_pages_blocks_features_features_icon" DEFAULT 'zap',
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum_pages_blocks_features_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_sponsors_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"new_tab" boolean DEFAULT true,
  	"logo_id" integer,
  	"url" varchar,
  	"tracking_id" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar DEFAULT 'sponsor',
  	"utm_campaign" varchar,
  	"utm_content" varchar,
  	"utm_term" varchar
  );
  
  CREATE TABLE "pages_blocks_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_role" varchar,
  	"author_image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_type" "enum__pages_v_blocks_features_features_media_type" DEFAULT 'icon',
  	"icon" "enum__pages_v_blocks_features_features_icon" DEFAULT 'zap',
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum__pages_v_blocks_features_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sponsors_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"new_tab" boolean DEFAULT true,
  	"logo_id" integer,
  	"url" varchar,
  	"tracking_id" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar DEFAULT 'sponsor',
  	"utm_campaign" varchar,
  	"utm_content" varchar,
  	"utm_term" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_author_image_id_media_id_fk" FOREIGN KEY ("author_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sponsors_sponsors" ADD CONSTRAINT "pages_blocks_sponsors_sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_sponsors_sponsors" ADD CONSTRAINT "pages_blocks_sponsors_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sponsors" ADD CONSTRAINT "pages_blocks_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_author_image_id_media_id_fk" FOREIGN KEY ("author_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_features" ADD CONSTRAINT "_pages_v_blocks_features_features_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_features" ADD CONSTRAINT "_pages_v_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sponsors_sponsors" ADD CONSTRAINT "_pages_v_blocks_sponsors_sponsors_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sponsors_sponsors" ADD CONSTRAINT "_pages_v_blocks_sponsors_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sponsors" ADD CONSTRAINT "_pages_v_blocks_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_testimonials_testimonials_order_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_testimonials_parent_id_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_testimonials_author_image_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("author_image_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_features_order_idx" ON "pages_blocks_features_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_features_parent_id_idx" ON "pages_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_features_image_idx" ON "pages_blocks_features_features" USING btree ("image_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_sponsors_sponsors_order_idx" ON "pages_blocks_sponsors_sponsors" USING btree ("_order");
  CREATE INDEX "pages_blocks_sponsors_sponsors_parent_id_idx" ON "pages_blocks_sponsors_sponsors" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sponsors_sponsors_logo_idx" ON "pages_blocks_sponsors_sponsors" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_sponsors_order_idx" ON "pages_blocks_sponsors" USING btree ("_order");
  CREATE INDEX "pages_blocks_sponsors_parent_id_idx" ON "pages_blocks_sponsors" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sponsors_path_idx" ON "pages_blocks_sponsors" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_order_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_author_image_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("author_image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_features_order_idx" ON "_pages_v_blocks_features_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_features_parent_id_idx" ON "_pages_v_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_features_image_idx" ON "_pages_v_blocks_features_features" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_features_order_idx" ON "_pages_v_blocks_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_parent_id_idx" ON "_pages_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_path_idx" ON "_pages_v_blocks_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_sponsors_sponsors_order_idx" ON "_pages_v_blocks_sponsors_sponsors" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sponsors_sponsors_parent_id_idx" ON "_pages_v_blocks_sponsors_sponsors" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sponsors_sponsors_logo_idx" ON "_pages_v_blocks_sponsors_sponsors" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_sponsors_order_idx" ON "_pages_v_blocks_sponsors" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sponsors_parent_id_idx" ON "_pages_v_blocks_sponsors" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sponsors_path_idx" ON "_pages_v_blocks_sponsors" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_features_features" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_sponsors_sponsors" CASCADE;
  DROP TABLE "pages_blocks_sponsors" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_features_features" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_sponsors_sponsors" CASCADE;
  DROP TABLE "_pages_v_blocks_sponsors" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_features_features_media_type";
  DROP TYPE "public"."enum_pages_blocks_features_features_icon";
  DROP TYPE "public"."enum_pages_blocks_features_columns";
  DROP TYPE "public"."enum__pages_v_blocks_features_features_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_features_features_icon";
  DROP TYPE "public"."enum__pages_v_blocks_features_columns";`)
}
