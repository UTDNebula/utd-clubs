CREATE TABLE IF NOT EXISTS "officers" (
	"id" text NOT NULL,
	"club_id" text NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"image" text DEFAULT '/nebula-logo.png' NOT NULL,
	"is_president" boolean DEFAULT false NOT NULL,
	CONSTRAINT officers_club_id_id PRIMARY KEY("club_id","id")
);
--> statement-breakpoint
ALTER TABLE "user_metadata_to_clubs" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "officers" ADD CONSTRAINT "officers_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
