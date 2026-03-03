import { and, eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildListenedAlbumId, listenedAlbumsTable } from "./listenedAlbums.schema";
import z from "zod";

export const removeAlbumFromListenedMutation = protectedProcedure
  .input(z.object({ id: z.string().min(1) }))
  .mutation(async (
    { input: { id }, ctx: { db, userId } }
  ) => {
    const existing = await db
      .select()
      .from(listenedAlbumsTable)
      .where(
        and(  
        eq(listenedAlbumsTable.id, id),
        eq(listenedAlbumsTable.userId, userId)));
    if (existing.length === 0) {
      console.log(`Album with id ${id} not found in listened list for user ${userId}`);
      return;
    }

    await db
      .delete(listenedAlbumsTable)
      .where(
        and(
          eq(listenedAlbumsTable.id, id),
          eq(listenedAlbumsTable.userId, userId)));
  });