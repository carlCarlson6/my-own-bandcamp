import { protectedProcedure } from "../infrastructure/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";
import { eq } from "drizzle-orm";

export const clearPendingMutation = protectedProcedure
  .mutation(async ({ ctx: { db, userId } }) => {
    await db
      .delete(pendingAlbumsTable)
      .where(eq(pendingAlbumsTable.userId, userId));
  });
