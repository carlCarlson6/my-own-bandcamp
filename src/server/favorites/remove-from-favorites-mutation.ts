import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { buildFavoriteAlbumId, favoritesAlbumsTable } from "./favoritesAlbums.schema";
import { eq } from "drizzle-orm";

// TODO - check if if album is already in favorites, if it is not finish process, if it is execute delete
export const removeAlbumFromFavoritesMutation = protectedProcedure
  .input(z.object({ albumId: z.string() }))
  .mutation(async (
    { input: { albumId }, ctx: { db, userId } }
  ) => db
    .delete(favoritesAlbumsTable)
    .where(
      eq(favoritesAlbumsTable.id, buildFavoriteAlbumId(albumId, userId))));
