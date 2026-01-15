DROP MATERIALIZED VIEW "public"."used_tags";--> statement-breakpoint
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
);