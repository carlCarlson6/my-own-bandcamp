import { eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildFavoriteAlbumId, favoritesAlbumsTable } from "./favoritesAlbums.schema";

export const saveToFavoritesMutation = protectedProcedure
  .input(z.object({
    id: z.string().min(1),
    url: z.string().min(1).url()
  }))
  .mutation(async ({ ctx: { userId, db }, input: { id, url } }) => {
    const existing = await db.select()
      .from(favoritesAlbumsTable)
      .where(
        eq(favoritesAlbumsTable.id, buildFavoriteAlbumId(id, userId)));
    if (existing.length > 0) {
      console.log(`Album ${id} is already on favorites for user ${userId}`);
      return existing.at(0)?.id;
    };

    const result = await db
      .insert(favoritesAlbumsTable)
      .values({
        id:       buildFavoriteAlbumId(id, userId),
        albumId:  id,
        albumUrl: url,
        userId:   userId
      })
      .returning();

    return result.at(0)?.id;
  });