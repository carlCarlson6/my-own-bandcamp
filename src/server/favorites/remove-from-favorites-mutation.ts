import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { favoritesAlbumsTable } from "./favoritesAlbums.schema";
import { and, eq } from "drizzle-orm";

export const removeAlbumFromFavoritesMutation = protectedProcedure
  .input(z.object({ albumId: z.string() }))
  .mutation(async ({ input: { albumId }, ctx: { db, userId } }) => {
    await db
      .delete(favoritesAlbumsTable)
      .where(
        and(
          eq(favoritesAlbumsTable.id, albumId),
          eq(favoritesAlbumsTable.userId, userId),
        ),
      );
  });
