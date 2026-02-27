import { eq, count, sql } from "drizzle-orm";
import { favoritesAlbumsTable } from "../favorites/favoritesAlbums.schema";
import { protectedProcedure } from "../infrastructure/trpc";
import { listenedAlbumsTable } from "../listened/listenedAlbums.schema";
import { pendingAlbumsTable } from "../pending/pendingAlbums.schema";
import type { Db } from "../infrastructure/db";

export const getAlumbsResumeQuery = protectedProcedure
  .query(async ({ ctx: { userId, db } }) => {
    const pending = await getPendingAlbums(db, userId);
    const favorites = await getFavoritesAlbums(db, userId);
    const listened = await getListenedAlbums(db, userId);
    return { pending, favorites, listened };
  });

export const getPendingAlbums = async (db: Db, userId: string) => {
  const pendingAlbums = await db
    .select({
      id: pendingAlbumsTable.albumId,
    })
    .from(pendingAlbumsTable)
    .where(eq(pendingAlbumsTable.userId, userId))
    .orderBy(sql`random()`)
    .limit(15);
  const pendinAlbumsCount = await db
    .select({
      count: count(),
    })
    .from(pendingAlbumsTable)
    .where(eq(pendingAlbumsTable.userId, userId));

  return {
    count: pendinAlbumsCount.at(0)?.count ?? 0,
    albums: pendingAlbums
  };
}

export const getFavoritesAlbums = async (db: Db, userId: string) => {
  const favoritesAlbums = await db
    .select({
      id: favoritesAlbumsTable.albumId,
    })
    .from(favoritesAlbumsTable)
    .where(eq(favoritesAlbumsTable.userId, userId))
    .orderBy(sql`random()`)
    .limit(15);
  const favoritesAlbumsCount = await db
    .select({
      count: count(),
    })
    .from(favoritesAlbumsTable)
    .where(eq(favoritesAlbumsTable.userId, userId));

  return {
    count: favoritesAlbumsCount.at(0)?.count ?? 0,
    albums: favoritesAlbums
  };
}

export const getListenedAlbums = async (db: Db, userId: string) => {
  const listenedAlbums = await db
    .select({
      id: listenedAlbumsTable.albumId,
    })
    .from(listenedAlbumsTable)
    .where(eq(listenedAlbumsTable.userId, userId))
    .orderBy(sql`random()`)
    .limit(15);
  const listenedAlbumsCount = await db
    .select({
      count: count(),
    })
    .from(listenedAlbumsTable)
    .where(eq(listenedAlbumsTable.userId, userId));

  return {
    count: listenedAlbumsCount.at(0)?.count ?? 0,
    albums: listenedAlbums
  };
}