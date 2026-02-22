import { and, eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { buildFavoriteAlbumId, favoritesAlbumsTable } from "./favoritesAlbums.schema";

export const saveToFavoritesMutation = protectedProcedure
  .input(z.object({
    albumId: z.string().min(1),
  }))
  .mutation(async ({ ctx: { userId, db }, input: { albumId } }) => {
    const existing = await db.select()
      .from(favoritesAlbumsTable)
      .where(
        eq(favoritesAlbumsTable.id, buildFavoriteAlbumId(albumId, userId)));
    if (existing.length > 0) return;

    await db
      .insert(favoritesAlbumsTable)
      .values({
        id:       buildFavoriteAlbumId(albumId, userId),
        albumId:  albumId,
        userId:   userId
      });
  });