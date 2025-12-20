ALTER TABLE "club" RENAME COLUMN "calendar_url" TO "calendar_id";--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "calendar_name" text;