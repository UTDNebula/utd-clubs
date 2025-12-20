ALTER TABLE "events" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "start_time" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "end_time" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "calendar_url" text;--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "calendar_sync_token" text;--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "calendar_webhook_id" text;--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "calendar_webhook_expiration" timestamp;--> statement-breakpoint
ALTER TABLE "club" ADD COLUMN "calendarGoogleAccountId" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "recurrence" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "reccurence_id" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "google" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "etag" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "club" ADD CONSTRAINT "club_calendarGoogleAccountId_account_id_fk" FOREIGN KEY ("calendarGoogleAccountId") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;