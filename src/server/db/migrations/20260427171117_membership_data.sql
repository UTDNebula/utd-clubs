ALTER TABLE "user_metadata_to_clubs" ALTER COLUMN "joined_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user_metadata_to_clubs" ALTER COLUMN "joined_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "membership_policy" "membership_policy" DEFAULT 'open' NOT NULL;--> statement-breakpoint
UPDATE "user_metadata_to_clubs" SET "member_type" = 'Follower' WHERE "member_type" = 'Member';--> statement-breakpoint
UPDATE "user_metadata_to_clubs" SET "joined_at" = NULL WHERE "member_type" IN ('Follower', 'Requested');