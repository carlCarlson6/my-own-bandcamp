CREATE TABLE "my-own-bc_favorites_albums" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"addedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_favorites_albums_user_id" ON "my-own-bc_favorites_albums" USING btree ("userId");--> statement-breakpoint
ALTER TABLE "my-own-bc_pending_albums" DROP COLUMN "imageUrl";