CREATE TABLE "calendar_webhooks" (
	"id" text PRIMARY KEY NOT NULL,
	"resource_id" text NOT NULL,
	"club_id" text NOT NULL,
	"token" text NOT NULL,
	"expiration" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calendar_webhooks" ADD CONSTRAINT "calendar_webhooks_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;