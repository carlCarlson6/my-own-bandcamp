import { eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildFavoriteAlbumId, favoritesAlbumsTable } from "./favoritesAlbums.schema";
import type { Db } from "../infrastructure/db";

export const saveToFavoritesMutation = protectedProcedure
  .input(z.object({
    id: z.string().min(1),
    url: z.string().min(1).url()
  }))
  .mutation((
    { ctx: { userId, db }, input: { id, url } }
  ) => saveAlbumToFavorites(db, userId, id, url));

export const saveAlbumToFavorites = async (db: Db, userId: string, albumId: string, albumUrl: string) => {
  const existing = await db.select()
    .from(favoritesAlbumsTable)
    .where(
      eq(favoritesAlbumsTable.id, buildFavoriteAlbumId(albumId, userId)));
  if (existing.length > 0) {
    console.log(`Album ${albumId} is already on favorites for user ${userId}`);
    return existing.at(0)?.id;
  };

  const result = await db
    .insert(favoritesAlbumsTable)
    .values({
      id:       buildFavoriteAlbumId(albumId, userId),
      albumId:  albumId,
      albumUrl: albumUrl,
      userId:   userId
    })
    .returning();

  return result.at(0)?.id;
}