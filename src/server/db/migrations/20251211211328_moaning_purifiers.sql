ALTER TABLE "club" DROP CONSTRAINT "club_calendarGoogleAccountId_account_id_fk";
--> statement-breakpoint
ALTER TABLE "club" ADD CONSTRAINT "club_calendarGoogleAccountId_user_id_fk" FOREIGN KEY ("calendarGoogleAccountId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;