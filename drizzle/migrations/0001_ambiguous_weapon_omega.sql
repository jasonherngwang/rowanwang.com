CREATE SCHEMA "camelchords";
--> statement-breakpoint
CREATE TABLE "camelchords"."libraries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "camelchords"."songs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"content" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"library_id" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "camelchords"."libraries" ADD CONSTRAINT "libraries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "camelchords"."songs" ADD CONSTRAINT "songs_library_id_libraries_id_fk" FOREIGN KEY ("library_id") REFERENCES "camelchords"."libraries"("id") ON DELETE cascade ON UPDATE no action;