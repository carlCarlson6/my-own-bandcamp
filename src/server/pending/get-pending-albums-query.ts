import { eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { pendingAlbums } from "./pendingAlbums.schema";

export const getPendingAlbumsQuery = protectedProcedure.query(async ({ ctx: { db, userId } }) => {
  return await db.select()
    .from(pendingAlbums)
    .where(eq(pendingAlbums.userId, userId))
    .orderBy(pendingAlbums.addedAt);
});