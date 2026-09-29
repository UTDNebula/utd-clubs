ALTER TABLE "club" ALTER COLUMN "schools" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "club" ALTER COLUMN "schools" SET DEFAULT '{}'::school_enum[]::text;--> statement-breakpoint
DROP TYPE "public"."school_enum";--> statement-breakpoint
CREATE TYPE "public"."school_enum" AS ENUM('bass', 'bbs', 'epps', 'ecs', 'is', 'jsom', 'nsm');--> statement-breakpoint
ALTER TABLE "club" ALTER COLUMN "schools" SET DEFAULT '{}'::school_enum[]::"public"."school_enum"[];--> statement-breakpoint
ALTER TABLE "club" ALTER COLUMN "schools" SET DATA TYPE "public"."school_enum"[] USING "schools"::"public"."school_enum"[];--> statement-breakpoint
ALTER TABLE "user_metadata_to_clubs" ALTER COLUMN "member_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."member_type";--> statement-breakpoint
CREATE TYPE "public"."member_type" AS ENUM('Admin', 'Collaborator', 'Member');--> statement-breakpoint
ALTER TABLE "user_metadata_to_clubs" ALTER COLUMN "member_type" SET DATA TYPE "public"."member_type" USING "member_type"::"public"."member_type";