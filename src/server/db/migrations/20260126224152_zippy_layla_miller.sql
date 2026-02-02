CREATE TYPE "public"."status_enum" AS ENUM('approved', 'rejected', 'pending', 'deleted');--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "approved" "status_enum" DEFAULT 'approved' NOT NULL;