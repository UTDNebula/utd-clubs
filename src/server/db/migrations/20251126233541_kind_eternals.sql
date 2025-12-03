CREATE TYPE "public"."approved_enum" AS ENUM('approved', 'rejected', 'pending');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('discord', 'instagram', 'website', 'email', 'twitter', 'facebook', 'youtube', 'twitch', 'linkedIn', 'other');--> statement-breakpoint
CREATE TYPE "public"."career" AS ENUM('Healthcare', 'Art and Music', 'Engineering', 'Business', 'Sciences', 'Public Service');--> statement-breakpoint
CREATE TYPE "public"."member_type" AS ENUM('President', 'Officer', 'Member');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Student', 'Student Organizer', 'Administrator');--> statement-breakpoint
CREATE TYPE "public"."year" AS ENUM('Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad Student');--> statement-breakpoint
CREATE TABLE "admin" (
	"userId" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "club" (
	"id" text PRIMARY KEY DEFAULT nanoid(20) NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"founding_date" text,
	"description" text NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"approved" "approved_enum" DEFAULT 'pending' NOT NULL,
	"profile_image" text,
	"soc" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"platform" "platform" NOT NULL,
	"url" text NOT NULL,
	"club_id" text NOT NULL,
	CONSTRAINT "contacts_platform_club_id_pk" PRIMARY KEY("platform","club_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY DEFAULT nanoid(20) NOT NULL,
	"club_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"location" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback_form" (
	"id" text PRIMARY KEY DEFAULT nanoid(20) NOT NULL,
	"rating" integer NOT NULL,
	"likes" text DEFAULT '',
	"dislikes" text DEFAULT '',
	"features" text DEFAULT '',
	"submit_on" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "officers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" text NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"image" text DEFAULT '/nebula-logo.png' NOT NULL,
	"is_president" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_ai_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"clubMatch" jsonb,
	"clubMatchLimit" integer
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
	CONSTRAINT "user_metadata_to_clubs_user_id_club_id_pk" PRIMARY KEY("user_id","club_id")
);
--> statement-breakpoint
CREATE TABLE "user_metadata_to_events" (
	"user_id" text NOT NULL,
	"event_id" text NOT NULL,
	CONSTRAINT "user_metadata_to_events_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_user_metadata_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "officers" ADD CONSTRAINT "officers_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metadata_to_clubs" ADD CONSTRAINT "user_metadata_to_clubs_user_id_user_metadata_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metadata_to_clubs" ADD CONSTRAINT "user_metadata_to_clubs_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metadata_to_events" ADD CONSTRAINT "user_metadata_to_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_metadata_to_events" ADD CONSTRAINT "user_metadata_to_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "club_search_idx" ON "club" USING bm25 ("id","name","description","tags","approved") WITH (key_field=id,text_fields='{"tags":{"tokenizer":{"type":"keyword"}},"name":{"tokenizer":{"type":"default","stemmer":"English"}}}',numeric_fields='{"approved":{"fast":true}}');--> statement-breakpoint
CREATE INDEX "club_name" ON "club" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "club_slug_unique" ON "club" USING btree ("slug");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."used_tags" AS (select UNNEST("club"."tags") as tag, COUNT("club"."tags") as count, from club order by count desc);
