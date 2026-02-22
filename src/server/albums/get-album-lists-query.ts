import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { buildPendingAlbumId, pendingAlbumsTable } from "../pending/pendingAlbums.schema";
import { and, eq } from "drizzle-orm";
import { favoritesAlbumsTable } from "../favorites/favoritesAlbums.schema";
import build from "next/dist/build";

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
        eq(favoritesAlbumsTable.id, buildPendingAlbumId(albumId, userId)))
      .limit(1)).at(0);
    
    return {
      id:           albumId,
      onPending:    Boolean(albumOnPending),
      onFavorites:  Boolean(albumOnFavorites),
    }
  });