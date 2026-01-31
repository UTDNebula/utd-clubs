DROP TYPE IF EXISTS "public"."student_classification" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."student_classification" AS ENUM('Student', 'Graduate Student', 'Alum', 'Prospective Student');--> statement-breakpoint
ALTER TYPE "public"."approved_enum" ADD VALUE IF NOT EXISTS 'deleted';--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."used_tags";--> statement-breakpoint
DROP INDEX "club_search_idx";--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN IF NOT EXISTS "alias" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "display_order" integer;--> statement-breakpoint
ALTER TABLE "officers" ADD COLUMN IF NOT EXISTS "display_order" integer;--> statement-breakpoint
ALTER TABLE "user_metadata" ADD COLUMN IF NOT EXISTS "student_classification" "student_classification" DEFAULT 'Student' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_metadata" ADD COLUMN IF NOT EXISTS "graduation_date" date;--> statement-breakpoint
ALTER TABLE "user_metadata" ADD COLUMN IF NOT EXISTS "contact_email" text;--> statement-breakpoint
CREATE INDEX "club_search_idx" ON "club" USING bm25 ("id","name","alias","description","tags","approved") WITH (key_field=id,text_fields='{"tags":{"tokenizer":{"type":"keyword"}},"name":{"tokenizer":{"type":"default","stemmer":"English"}}}',numeric_fields='{"approved":{"fast":true}}');--> statement-breakpoint
ALTER TABLE "user_metadata" DROP COLUMN IF EXISTS "year";--> statement-breakpoint
ALTER TABLE "user_metadata" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "user_metadata" DROP COLUMN IF EXISTS "career";--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."used_tags" AS (
  SELECT 
    tag, 
    COUNT(*) as count, 
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)::integer as id 
  FROM (
    SELECT UNNEST("club"."tags") as tag FROM "club"
  ) sub 
  GROUP BY tag 
  ORDER BY count DESC
);--> statement-breakpoint
DROP TYPE "public"."career";--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
DROP TYPE "public"."year";
