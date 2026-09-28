CREATE EXTENSION IF NOT EXISTS "lakebase_text";--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS "pg_trgm";--> statement-breakpoint
DROP INDEX IF EXISTS "club_search_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "event_search_idx";--> statement-breakpoint
DROP EXTENSION IF EXISTS "pg_search" CASCADE;--> statement-breakpoint
CREATE OR REPLACE FUNCTION immutable_array_to_string(arr text[], sep text)
RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT array_to_string(arr, sep);
$$;--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "search_tsv" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', coalesce(alias, '')), 'A') || setweight(to_tsvector('english', coalesce(name, '')), 'A') || setweight(to_tsvector('english', coalesce(immutable_array_to_string(tags, ' '), '')), 'B') || setweight(to_tsvector('english', coalesce(description, '')), 'C')) STORED;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "search_tsv" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', coalesce(name, '')), 'A') || setweight(to_tsvector('english', coalesce(location, '')), 'B') || setweight(to_tsvector('english', coalesce(description, '')), 'C')) STORED;--> statement-breakpoint
CREATE INDEX "club_search_idx" ON "club" USING lakebase_bm25 ("search_tsv");--> statement-breakpoint
CREATE INDEX "club_name_trgm_idx" ON "club" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "club_alias_trgm_idx" ON "club" USING gin ("alias" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "event_search_idx" ON "events" USING lakebase_bm25 ("search_tsv");