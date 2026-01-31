CREATE TABLE "membership_forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"display_order" integer
);
--> statement-breakpoint
ALTER TABLE "membership_forms" ADD CONSTRAINT "membership_forms_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE no action ON UPDATE no action;