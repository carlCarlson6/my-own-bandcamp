import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { buildPendingAlbumId, pendingAlbumsTable } from "../pending/pendingAlbums.schema";
import { eq } from "drizzle-orm";
import { buildFavoriteAlbumId, favoritesAlbumsTable } from "../favorites/favoritesAlbums.schema";
import { buildListenedAlbumId, listenedAlbumsTable } from "../listened/listenedAlbums.schema";

export const getAlbumListsQuery = protectedProcedure
  .input(z.object({
    albumId: z.string(),
  }))
  .query(async ({ input: { albumId }, ctx: { userId, db } }) => {  
    const albumOnPending = (await db
      .select()
      .from(pendingAlbumsTable)
      .where(
        eq(pendingAlbumsTable.id, buildPendingAlbumId(albumId, userId)))
      .limit(1)).at(0);
    const albumOnFavorites = (await db
      .select()
      .from(favoritesAlbumsTable)
      .where(
        eq(favoritesAlbumsTable.id, buildFavoriteAlbumId(albumId, userId)))
      .limit(1)).at(0);
    const albumOnListened = (await db
      .select()
      .from(listenedAlbumsTable)
      .where(
        eq(listenedAlbumsTable.id, buildListenedAlbumId(albumId, userId)))
      .limit(1)).at(0);
    
    return {
      id:           albumId,
      onPending:    Boolean(albumOnPending),
      onFavorites:  Boolean(albumOnFavorites),
      onListened:   Boolean(albumOnListened),
    }
  });