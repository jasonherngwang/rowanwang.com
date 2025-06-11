ALTER TABLE "camelchords"."libraries" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "camelchords"."libraries" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "camelchords"."songs" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "camelchords"."songs" ALTER COLUMN "is_public" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "camelchords"."songs" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "camelchords"."songs" ALTER COLUMN "updated_at" SET DEFAULT now();