import { index } from "drizzle-orm/pg-core";
import { createTable } from "../infrastructure/db/schema";

export const pendingAlbumsTable = createTable(
  "pending_albums", 
  (t) => ({
    id:       t.text().primaryKey(),
    albumId:  t.text().notNull(),
    userId:   t.text().notNull(),
    addedAt:  t.timestamp().defaultNow().notNull(),
  }),
  (t) => ([
    index("idx_pending_albums_user_id").on(t.userId)
  ])
);

export const buildPendingAlbumId = (albumId: string, userId: string) => `${albumId}-${userId}`;

