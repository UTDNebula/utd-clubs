ALTER TABLE "user_metadata_to_events" DROP CONSTRAINT "user_metadata_to_events_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "user_metadata_to_events" ADD CONSTRAINT "user_metadata_to_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action DEFERRABLE INITIALLY DEFERRED;
