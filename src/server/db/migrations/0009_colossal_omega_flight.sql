ALTER TABLE "officers" DROP CONSTRAINT "officers_club_id_id";--> statement-breakpoint
ALTER TABLE "officers" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "officers" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "officers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();