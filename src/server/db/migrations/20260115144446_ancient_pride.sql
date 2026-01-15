CREATE TYPE "public"."approved_enum" AS ENUM('approved', 'rejected', 'pending', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('discord', 'instagram', 'website', 'email', 'twitter', 'facebook', 'youtube', 'twitch', 'linkedIn', 'other');--> statement-breakpoint
CREATE TYPE "public"."career" AS ENUM('Healthcare', 'Art and Music', 'Engineering', 'Business', 'Sciences', 'Public Service');--> statement-breakpoint
CREATE TYPE "public"."member_type" AS ENUM('President', 'Officer', 'Member');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Student', 'Student Organizer', 'Administrator');--> statement-breakpoint
CREATE TYPE "public"."year" AS ENUM('Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad Student');--> statement-breakpoint
CREATE TABLE "admin" (
	"userId" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club" (
	"id" text PRIMARY KEY DEFAULT nanoid(20) NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"founding_date" timestamp,
	"updated_at" timestamp,
	"description" text NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"approved" "approved_enum" DEFAULT 'pending' NOT NULL,
	"profile_image" text,
	"banner_image" text,
	"soc" boolean DEFAULT false NOT NULL,
	"page_views" integer DEFAULT 0 NOT NULL,
	"calendar_id" text,
	"calendar_name" text,
	"calendar_sync_token" text,
	"calendar_webhook_id" text,
	"calendar_webhook_expiration" timestamp,
	"calendarGoogleAccountId" text
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"platform" "platform" NOT NULL,
	"url" text NOT NULL,
	"club_id" text NOT NULL,
	"display_order" integer,
	CONSTRAINT "contacts_platform_club_id_pk" PRIMARY KEY("platform","club_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY DEFAULT nanoid(20) NOT NULL,
	"club_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"recurrence" text,
	"recurence_id" text,
	"google" boolean DEFAULT false NOT NULL,
	"etag" text,
	"location" text DEFAULT '' NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "officers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" text NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"display_order" integer
);
--> statement-breakpoint
CREATE TABLE "user_ai_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"clubMatch" jsonb,
	"clubMatchLimit" integer,
	"responses" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"major" text NOT NULL,
	"minor" text,
	"year" "year" NOT NULL,
	"role" "role" NOT NULL,
	"career" "career"
);
--> statement-breakpoint
CREATE TABLE "user_metadata_to_clubs" (
	"user_id" text NOT NULL,
	"club_id" text NOT NULL,
	"member_type" "member_type" NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_metadata_to_clubs_user_id_club_id_pk" PRIMARY KEY("user_id","club_id")
);
--> statement-breakpoint
CREATE TABLE "user_metadata_to_events" (
	"user_id" text NOT NULL,
	"event_id" text NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_metadata_to_events_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_user_metadata_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club" ADD CONSTRAINT "club_calendarGoogleAccountId_user_id_fk" FOREIGN KEY ("calendarGoogleAccountId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "officers" ADD CONSTRAINT "officers_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metadata_to_clubs" ADD CONSTRAINT "user_metadata_to_clubs_user_id_user_metadata_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metadata_to_clubs" ADD CONSTRAINT "user_metadata_to_clubs_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metadata_to_events" ADD CONSTRAINT "user_metadata_to_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metadata_to_events" ADD CONSTRAINT "user_metadata_to_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "club_search_idx" ON "club" USING bm25 ("id","name","description","tags","approved") WITH (key_field=id,text_fields='{"tags":{"tokenizer":{"type":"keyword"}},"name":{"tokenizer":{"type":"default","stemmer":"English"}}}',numeric_fields='{"approved":{"fast":true}}');--> statement-breakpoint
CREATE INDEX "club_name" ON "club" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "club_slug_unique" ON "club" USING btree ("slug");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."used_tags" AS (select UNNEST("club"."tags") as tag, COUNT("club"."tags") as count, from club order by count desc);