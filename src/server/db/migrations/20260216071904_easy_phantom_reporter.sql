CREATE TYPE "public"."club_size" AS ENUM('1-10', '10-50', '50-200', '200+');--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "club_size" "club_size";