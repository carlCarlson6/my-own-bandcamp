import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { pendingAlbumsTable } from "../pending/pendingAlbums.schema";
import { and, eq } from "drizzle-orm";
import { favoritesAlbumsTable } from "../favorites/favoritesAlbums.schema";

export const getAlbumListsQuery = protectedProcedure
  .input(z.object({
    albumId: z.string(),
  }))
  .query(async ({ input: { albumId }, ctx: { userId, db } }) => {  
    const albumOnPending = (await db
      .select()
      .from(pendingAlbumsTable)
      .where(
        and(
          eq(pendingAlbumsTable.userId, userId),
          eq(pendingAlbumsTable.id, albumId)))
      .limit(1)).at(0);
    const albumOnFavorites = (await db
      .select()
      .from(favoritesAlbumsTable)
      .where(
        and(
          eq(favoritesAlbumsTable.userId, userId),
          eq(favoritesAlbumsTable.id, albumId)))
      .limit(1)).at(0);
    
    return {
      id:           albumId,
      onPending:    Boolean(albumOnPending),
      onFavorites:  Boolean(albumOnFavorites),
    }
  });