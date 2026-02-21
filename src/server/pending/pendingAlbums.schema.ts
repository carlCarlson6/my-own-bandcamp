import { index } from "drizzle-orm/pg-core";
import { createTable } from "../infrastructure/db/schema";

export const pendingAlbums = createTable(
  "pending_albums", 
  (t) => ({
    id:       t.text().primaryKey(),
    userId:   t.text().notNull(),
    title:    t.text().notNull(),
    artist:   t.text().notNull(),
    imageUrl: t.text().notNull(),
    addedAt:  t.timestamp().defaultNow().notNull(),
  }), 
  (t) => ([
    index("idx_pending_albums_user_id").on(t.userId)
  ]
));