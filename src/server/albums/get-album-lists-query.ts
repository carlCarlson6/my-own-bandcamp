import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildPendingAlbumId, pendingAlbumsTable } from "../pending/pendingAlbums.schema";
import { and, eq, is } from "drizzle-orm";
import { buildFavoriteAlbumId, favoritesAlbumsTable } from "../favorites/favoritesAlbums.schema";
import { buildListenedAlbumId, listenedAlbumsTable } from "../listened/listenedAlbums.schema";
import { playlistAlbumsTable, userPlaylistsTable } from "../playlists/playlists.schema";
import type { Db } from "../infrastructure/db";

export const getAlbumListsQuery = protectedProcedure
  .input(z.object({
    albumId: z.string(),
  }))
  .query(async ({ input: { albumId }, ctx: { userId, db } }) => getAlbumsLists(albumId, userId, db));

const getAlbumsLists = async (albumId: string, userId: string, db: Db) => {
  const albumOnPending = (await db
    .select()
    .from(pendingAlbumsTable)
    .where(
      eq(pendingAlbumsTable.id, buildPendingAlbumId(albumId, userId)))
    .limit(1)
  ).at(0);
  const albumOnFavorites = (await db
    .select()
    .from(favoritesAlbumsTable)
    .where(
      eq(favoritesAlbumsTable.id, buildFavoriteAlbumId(albumId, userId)))
    .limit(1)
  ).at(0);
  const albumOnListened = (await db
    .select()
    .from(listenedAlbumsTable)
    .where(
      eq(listenedAlbumsTable.id, buildListenedAlbumId(albumId, userId)))
    .limit(1)
  ).at(0);

  const onUserLists = await db
    .select({
      id:   userPlaylistsTable.id,
      name: userPlaylistsTable.name,
      isOn: playlistAlbumsTable.id
    })
    .from(userPlaylistsTable)
    .where(
      eq(userPlaylistsTable.userId, userId))
    .leftJoin(playlistAlbumsTable,
      and(
        eq(playlistAlbumsTable.playlistId, userPlaylistsTable.id),
        eq(playlistAlbumsTable.albumId, albumId)));
      
  return {
    id:           albumId,
    onPending:    albumOnPending?.id,
    onFavorites:  albumOnFavorites?.id,
    onListened:   albumOnListened?.id,
    onUserLists
  };
}