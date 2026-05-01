CREATE TYPE "public"."membership_policy" AS ENUM('open', 'request', 'closed');--> statement-breakpoint
ALTER TYPE "public"."member_type" ADD VALUE 'Follower';--> statement-breakpoint
ALTER TYPE "public"."member_type" ADD VALUE 'Requested';