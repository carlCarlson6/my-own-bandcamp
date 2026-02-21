import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";
import { and, eq } from "drizzle-orm";

export const removeAlbumFromPendingMutation = protectedProcedure
  .input(z.object({ albumId: z.string() }))
  .mutation(async ({ input: { albumId }, ctx: { db, userId } }) => {
    await db.delete(pendingAlbumsTable)
      .where(
        and(
          eq(pendingAlbumsTable.id, albumId),
          eq(pendingAlbumsTable.userId, userId)
        )
      );
  });