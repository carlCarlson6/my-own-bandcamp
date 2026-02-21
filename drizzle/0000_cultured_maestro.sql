CREATE TABLE "my-own-bc_pending_albums" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"imageUrl" text NOT NULL,
	"addedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_pending_albums_user_id" ON "my-own-bc_pending_albums" USING btree ("userId");