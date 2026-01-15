ALTER TYPE "public"."approved_enum" ADD VALUE 'deleted';--> statement-breakpoint
DROP MATERIALIZED VIEW IF EXISTS "public"."used_tags";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
DROP INDEX "club_name";--> statement-breakpoint
DROP INDEX "club_search_idx";--> statement-breakpoint
DROP INDEX "club_slug_unique";--> statement-breakpoint
DROP INDEX "account_userId_idx";--> statement-breakpoint
DROP INDEX "verification_identifier_idx";--> statement-breakpoint
ALTER TABLE "club" ALTER COLUMN "tags" SET DEFAULT '{}'::text[];--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "alias" text;--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "club_name" ON "club" USING btree ("name");--> statement-breakpoint
CREATE INDEX "club_search_idx" ON "club" USING bm25 ("id","name","description","tags","approved") WITH (key_field=id,text_fields='{"tags":{"tokenizer":{"type":"keyword"}},"name":{"tokenizer":{"type":"default","stemmer":"English"}}}',numeric_fields='{"approved":{"fast":true}}');--> statement-breakpoint
CREATE UNIQUE INDEX "club_slug_unique" ON "club" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."used_tags" AS (
    SELECT 
        tag, 
        COUNT(*) as count, 
        ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)::integer as id 
    FROM (
        SELECT UNNEST(tags) as tag FROM "club"
    ) sub 
    GROUP BY tag 
    ORDER BY count DESC
);