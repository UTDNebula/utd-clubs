ALTER TYPE "public"."member_type" RENAME VALUE 'President' TO 'Admin';--> statement-breakpoint
ALTER TYPE "public"."member_type" RENAME VALUE 'Officer' TO 'Collaborator';--> statement-breakpoint

ALTER TYPE "public"."school_enum" RENAME VALUE 'Harry W. Bass Jr. School of Arts, Humanities, and Technology' TO 'bass';--> statement-breakpoint
ALTER TYPE "public"."school_enum" RENAME VALUE 'School of Behavioral and Brain Sciences' TO 'bbs';--> statement-breakpoint
ALTER TYPE "public"."school_enum" RENAME VALUE 'School of Economic, Political and Policy Sciences' TO 'epps';--> statement-breakpoint
ALTER TYPE "public"."school_enum" RENAME VALUE 'Erik Jonsson School of Engineering and Computer Science' TO 'ecs';--> statement-breakpoint
ALTER TYPE "public"."school_enum" RENAME VALUE 'School of Interdisciplinary Studies' TO 'is';--> statement-breakpoint
ALTER TYPE "public"."school_enum" RENAME VALUE 'Naveen Jindal School of Management' TO 'jsom';--> statement-breakpoint
ALTER TYPE "public"."school_enum" RENAME VALUE 'School of Natural Sciences and Mathematics' TO 'nsm';--> statement-breakpoint