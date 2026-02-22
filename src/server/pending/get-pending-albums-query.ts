import { eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";

export const getPendingAlbumsQuery = protectedProcedure
  .query(async (
    { ctx: { db, userId } }
  ) => db
    .select({
      id: pendingAlbumsTable.albumId,
    })
    .from(pendingAlbumsTable)
    .where(eq(pendingAlbumsTable.userId, userId))
    .orderBy(pendingAlbumsTable.addedAt));