-- Make joined_at nullable: it now represents when a user became a Member, not when they started following
ALTER TABLE "user_metadata_to_clubs" ALTER COLUMN "joined_at" DROP NOT NULL;
ALTER TABLE "user_metadata_to_clubs" ALTER COLUMN "joined_at" DROP DEFAULT;

-- Clear joined_at for existing Followers and Requested since the timestamp was follow time, not join time
UPDATE "user_metadata_to_clubs" SET "joined_at" = NULL WHERE "member_type" IN ('Follower', 'Requested');
