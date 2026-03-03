import { protectedProcedure } from "../infrastructure/trpc";
import { favoritesAlbumsTable } from "./favoritesAlbums.schema";
import { eq } from "drizzle-orm";

export const clearFavoritesMutation = protectedProcedure
  .mutation(async ({ ctx: { db, userId } }) => {
    await db
      .delete(favoritesAlbumsTable)
      .where(eq(favoritesAlbumsTable.userId, userId));
  });
