import { eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { favoritesAlbumsTable } from "./favoritesAlbums.schema";

export const getFavoriteAlbumsQuery = protectedProcedure
  .query(
    ({ ctx: { db, userId } }
  ) => db
    .select({
      id:   favoritesAlbumsTable.albumId,
      url:  favoritesAlbumsTable.albumUrl
    })
    .from(favoritesAlbumsTable)
    .where(eq(favoritesAlbumsTable.userId, userId))
    .orderBy(favoritesAlbumsTable.addedAt));