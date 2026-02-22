import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { buildFavoriteAlbumId, favoritesAlbumsTable } from "./favoritesAlbums.schema";
import { eq } from "drizzle-orm";

export const removeAlbumFromFavoritesMutation = protectedProcedure
  .input(z.object({ albumId: z.string() }))
  .mutation(async (
    { input: { albumId }, ctx: { db, userId } }
  ) => {
    const existing = await db
      .select()
      .from(favoritesAlbumsTable)
      .where(
        eq(favoritesAlbumsTable.id, buildFavoriteAlbumId(albumId, userId)));
    if (existing.length === 0) return;

    await db
      .delete(favoritesAlbumsTable)
      .where(
        eq(favoritesAlbumsTable.id, buildFavoriteAlbumId(albumId, userId)),
      );
  });
