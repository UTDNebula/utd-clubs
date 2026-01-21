-- Custom SQL migration file, put your code below! --

CREATE TYPE "public"."student_classification" AS ENUM('Student', 'Graduate Student', 'Alum', 'Prospective Student');--> statement-breakpoint
ALTER TABLE "user_metadata" ADD COLUMN "student_classification" "student_classification" DEFAULT 'Student' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_metadata" ADD COLUMN "graduation_date" date;--> statement-breakpoint
ALTER TABLE "user_metadata" ADD COLUMN "contact_email" text;--> statement-breakpoint
UPDATE "user_metadata" SET
  "graduation_date" = CASE
    WHEN "year" = 'Freshman' THEN '2029-05-01'::DATE
    WHEN "year" = 'Sophomore' THEN '2028-05-01'::DATE
    WHEN "year" = 'Junior' THEN '2027-05-01'::DATE
    WHEN "year" = 'Senior' THEN '2026-05-01'::DATE
    WHEN "year" = 'Grad Student' THEN NULL
    ELSE '2029-05-01'::DATE
  END,
  "student_classification" = CASE
    WHEN "year" = 'Grad Student' THEN 'Graduate Student'::"student_classification"
    ELSE 'Student'::"student_classification"
  END;--> statement-breakpoint
ALTER TABLE "user_metadata" DROP COLUMN "year";