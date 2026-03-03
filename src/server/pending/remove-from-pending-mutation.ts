import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";
import { and, eq } from "drizzle-orm";

export const removeAlbumFromPendingMutation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async (
    { input: { id }, ctx: { db, userId } }
  ) => {
    const existing = await db
      .select()
      .from(pendingAlbumsTable)
      .where(
        and(
        eq(pendingAlbumsTable.id, id),
        eq(pendingAlbumsTable.userId, userId)));
    if (existing.length === 0) {
      console.log(`Album with id ${id} not found in pending list for user ${userId}`);
      return;
    }

    await db
      .delete(pendingAlbumsTable)
      .where(
        and(
          eq(pendingAlbumsTable.id, id),
          eq(pendingAlbumsTable.userId, userId)));
  });