CREATE TYPE "public"."event_collab_invite_status" AS ENUM('accepted', 'pending', 'rejected');--> statement-breakpoint
CREATE TABLE "event_collab_invites" (
	"event_id" text NOT NULL,
	"inviter_club_id" text NOT NULL,
	"invitee_club_id" text NOT NULL,
	"status" "event_collab_invite_status" NOT NULL,
	CONSTRAINT "event_collab_invites_event_id_invitee_club_id_pk" PRIMARY KEY("event_id","invitee_club_id")
);
--> statement-breakpoint
ALTER TABLE "event_collab_invites" ADD CONSTRAINT "event_collab_invites_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_collab_invites" ADD CONSTRAINT "event_collab_invites_inviter_club_id_club_id_fk" FOREIGN KEY ("inviter_club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_collab_invites" ADD CONSTRAINT "event_collab_invites_invitee_club_id_club_id_fk" FOREIGN KEY ("invitee_club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;