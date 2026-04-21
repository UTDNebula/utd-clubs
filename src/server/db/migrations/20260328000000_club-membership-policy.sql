-- Add new values to the member_type enum
ALTER TYPE "member_type" ADD VALUE IF NOT EXISTS 'Follower';
ALTER TYPE "member_type" ADD VALUE IF NOT EXISTS 'Requested';

-- Create the membership_policy enum (idempotent)
DO $$ BEGIN
  CREATE TYPE "membership_policy" AS ENUM ('open', 'request', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add membership_policy column to club table
ALTER TABLE "club" ADD COLUMN IF NOT EXISTS "membership_policy" "membership_policy" DEFAULT 'open' NOT NULL;

-- Convert all existing 'Member' rows to 'Follower'
UPDATE "user_metadata_to_clubs" SET "member_type" = 'Follower' WHERE "member_type" = 'Member';
