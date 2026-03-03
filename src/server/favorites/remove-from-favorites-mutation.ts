import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { favoritesAlbumsTable } from "./favoritesAlbums.schema";
import { eq, and } from "drizzle-orm";

export const removeAlbumFromFavoritesMutation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async (
    { input: { id }, ctx: { db, userId } }
  ) => {
    const existing = await db
      .select()
      .from(favoritesAlbumsTable)
      .where(
        and(
          eq(favoritesAlbumsTable.id, id),
          eq(favoritesAlbumsTable.userId, userId),
        ));
    if (existing.length === 0) {
      console.warn(`Trying to delete non existing favorite album with id ${id}`);
      return;
    }

    await db
      .delete(favoritesAlbumsTable)
      .where(
        and(
          eq(favoritesAlbumsTable.id, id),
          eq(favoritesAlbumsTable.userId, userId),
        ));
  });
