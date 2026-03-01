import { count, eq, sql } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { playlistAlbumsTable, userPlaylistsTable } from "./playlists.schema";
import type { Db } from "../infrastructure/db";

export const getPlaylistsResumeQuery = protectedProcedure
  .query(async ({ ctx: { db, userId } }) => {
    const userPlayLists = await db
      .select({ 
        id:   userPlaylistsTable.id, 
        name: userPlaylistsTable.name 
      })
      .from(userPlaylistsTable)
      .where(eq(userPlaylistsTable.userId, userId));
    
    const playlistsResume = [];
    for (const playlist of userPlayLists) {
      const info = await readPlaylistInfo(db, playlist);
      playlistsResume.push(info);
    }

    return playlistsResume;
  });

const readPlaylistInfo = async (db: Db, playlist: { id: string, name: string }) => {
  const totalAlbums = await db
    .select({
      count: count(),    
    })
    .from(playlistAlbumsTable)
    .where(eq(playlistAlbumsTable.playlistId, playlist.id));
  const randomAlbums = await db
      .select({
        id:     playlistAlbumsTable.id,
        albumId: playlistAlbumsTable.albumId,
      })
      .from(playlistAlbumsTable)
      .where(eq(playlistAlbumsTable.playlistId, playlist.id))
      .orderBy(sql`random()`)
      .limit(15);

  return {
    id: playlist.id,
    name: playlist.name,
    count:  totalAlbums.at(0)?.count ?? 0,
    albums: randomAlbums,
  };
}