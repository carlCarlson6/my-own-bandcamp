import { index } from "drizzle-orm/pg-core";
import { createTable } from "../infrastructure/db/schema";

export const listenedAlbumsTable = createTable(
  "listened_albums", 
  (t) => ({
    id:       t.text().primaryKey(),
    albumId:  t.text().notNull(),
    albumUrl: t.text().notNull(),
    userId:   t.text().notNull(),
    addedAt:  t.timestamp().defaultNow().notNull(),
  }), 
  (t) => ([
    index("idx_listened_albums_user_id").on(t.userId)
  ])
);

export const buildListenedAlbumId = (albumId: string, userId: string) => `${albumId}-${userId}`;