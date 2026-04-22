-- Issue 611: Change events PK from (id) to (id, club_id)
-- and add club_id to user_metadata_to_events for composite FK

-- 1. Drop old FK from user_metadata_to_events → events(id)
ALTER TABLE "user_metadata_to_events" DROP CONSTRAINT "user_metadata_to_events_event_id_events_id_fk";--> statement-breakpoint

-- 2. Drop old PK on events
ALTER TABLE "events" DROP CONSTRAINT "events_pkey";--> statement-breakpoint

-- 3. Add composite PK on events (id, club_id)
ALTER TABLE "events" ADD CONSTRAINT "events_id_club_id_pk" PRIMARY KEY ("id", "club_id");--> statement-breakpoint

-- 4. Drop old PK on user_metadata_to_events
ALTER TABLE "user_metadata_to_events" DROP CONSTRAINT "user_metadata_to_events_user_id_event_id_pk";--> statement-breakpoint

-- 5. Add club_id column (nullable first for backfill)
ALTER TABLE "user_metadata_to_events" ADD COLUMN "club_id" text;--> statement-breakpoint

-- 6. Backfill club_id from events table
UPDATE "user_metadata_to_events" AS um
SET "club_id" = e."club_id"
FROM "events" AS e
WHERE um."event_id" = e."id";--> statement-breakpoint

-- 7. Delete orphaned registrations that have no matching event
DELETE FROM "user_metadata_to_events" WHERE "club_id" IS NULL;--> statement-breakpoint

-- 8. Make club_id NOT NULL
ALTER TABLE "user_metadata_to_events" ALTER COLUMN "club_id" SET NOT NULL;--> statement-breakpoint

-- 9. Add new composite PK on user_metadata_to_events
ALTER TABLE "user_metadata_to_events" ADD CONSTRAINT "user_metadata_to_events_user_id_event_id_club_id_pk" PRIMARY KEY ("user_id", "event_id", "club_id");--> statement-breakpoint

-- 10. Add composite FK from user_metadata_to_events(event_id, club_id) → events(id, club_id)
ALTER TABLE "user_metadata_to_events" ADD CONSTRAINT "user_metadata_to_events_event_id_club_id_events_id_club_id_fk" FOREIGN KEY ("event_id", "club_id") REFERENCES "public"."events"("id", "club_id") ON DELETE no action ON UPDATE no action;
