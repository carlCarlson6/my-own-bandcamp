import { index } from "drizzle-orm/pg-core";
import { createTable } from "../infrastructure/db/schema";

export const userPlaylistsTable = createTable(
  "user_playlists",
  (t) => ({
    id:         t.text().primaryKey(),
    name:       t.text().notNull(),
    userId:     t.text().notNull(),
    createdAt:  t.timestamp().defaultNow().notNull(),
  }),
  (t) => ([
    index("idx_user_playlists_user_id").on(t.userId)
  ])
);

export const playlistAlbumsTable = createTable(
  "playlist_albums",
  (t) => ({
    id:         t.text().primaryKey(),
    playlistId: t.text().notNull(),
    albumId:    t.text().notNull(),
    addedAt:    t.timestamp().defaultNow().notNull(),
  }),
  (t) => ([
    index("idx_playlist_albums_playlist_id").on(t.playlistId)
  ])
);