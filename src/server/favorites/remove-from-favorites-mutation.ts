import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { favoritesAlbumsTable } from "./favoritesAlbums.schema";
import { eq, and } from "drizzle-orm";
import type { Db } from "../infrastructure/db";

export const removeAlbumFromFavoritesMutation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation((
    { input: { id }, ctx: { db, userId } }
  ) => removeAlbumFromFavorites(db, userId, id));

export const removeAlbumFromFavorites = async (db: Db, userId: string, favoriteAlbumId: string) => {
  const existing = await db
    .select()
    .from(favoritesAlbumsTable)
    .where(
      and(
        eq(favoritesAlbumsTable.id, favoriteAlbumId),
        eq(favoritesAlbumsTable.userId, userId),
      ));
  if (existing.length === 0) {
    console.warn(`Trying to delete non existing favorite album with id ${favoriteAlbumId}`);
    return;
  }

  await db
    .delete(favoritesAlbumsTable)
    .where(
      and(
        eq(favoritesAlbumsTable.id, favoriteAlbumId),
        eq(favoritesAlbumsTable.userId, userId),
      ));
}