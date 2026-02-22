import { index } from "drizzle-orm/pg-core";
import { createTable } from "../infrastructure/db/schema";

export const favoritesAlbumsTable = createTable(
  "favorites_albums", 
  (t) => ({
    id:       t.text().primaryKey(),
    albumId:  t.text().notNull(),
    albumUrl: t.text().notNull(),
    userId:   t.text().notNull(),
    addedAt:  t.timestamp().defaultNow().notNull(),
  }), 
  (t) => ([
    index("idx_favorites_albums_user_id").on(t.userId)
  ])
);

export const buildFavoriteAlbumId = (albumId: string, userId: string) => `${albumId}-${userId}`;