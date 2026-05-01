DO $$ BEGIN
  CREATE TYPE "public"."membership_policy" AS ENUM('open', 'request', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
ALTER TYPE "public"."member_type" ADD VALUE IF NOT EXISTS 'Follower';--> statement-breakpoint
ALTER TYPE "public"."member_type" ADD VALUE IF NOT EXISTS 'Requested';