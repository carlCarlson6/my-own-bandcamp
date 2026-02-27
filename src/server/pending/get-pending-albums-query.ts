import { eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";

export const getPendingAlbumsQuery = protectedProcedure
  .query(async (
    { ctx: { db, userId } }
  ) => db
    .select({
      id:   pendingAlbumsTable.albumId,
      url:  pendingAlbumsTable.albumUrl,
    })
    .from(pendingAlbumsTable)
    .where(eq(pendingAlbumsTable.userId, userId))
    .orderBy(pendingAlbumsTable.addedAt));