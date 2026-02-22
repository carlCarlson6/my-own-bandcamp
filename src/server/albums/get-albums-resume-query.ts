import { eq } from "drizzle-orm";
import { favoritesAlbumsTable } from "../favorites/favoritesAlbums.schema";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { listenedAlbumsTable } from "../listened/listenedAlbums.schema";
import { pendingAlbumsTable } from "../pending/pendingAlbums.schema";

export const getAlumbsResumeQuery = protectedProcedure
  .query(async ({ ctx: { userId, db } }) => {
    const pendingAlbumsCount = await db
      .select({
        id: pendingAlbumsTable.albumId,
      })
      .from(pendingAlbumsTable)
      .where(eq(pendingAlbumsTable.userId, userId))
      .limit(15);
    const favoritesAlbumsCount = await db
      .select({
        id: favoritesAlbumsTable.albumId,
      })
      .from(favoritesAlbumsTable)
      .where(eq(favoritesAlbumsTable.userId, userId))
      .limit(15);
    const listenedAlbumsCount = await db
      .select({
        id: listenedAlbumsTable.albumId,
      })
      .from(listenedAlbumsTable)
      .where(eq(listenedAlbumsTable.userId, userId))
      .limit(15);

    return {
      pending: pendingAlbumsCount,
      favorites: favoritesAlbumsCount,
      listened: listenedAlbumsCount,
    }
  });