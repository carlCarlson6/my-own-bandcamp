import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";
import { and, eq } from "drizzle-orm";
import type { Db } from "../infrastructure/db";

export const removeAlbumFromPendingMutation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation((
    { input: { id }, ctx: { db, userId } }
  ) => 
    removeAlbumFromPending(db, userId, id)
  );

export const removeAlbumFromPending = async (db: Db, userId: string, pendingAlbumId: string) => { 
  const existing = await db
    .select()
    .from(pendingAlbumsTable)
    .where(
      and(
      eq(pendingAlbumsTable.id, pendingAlbumId),
      eq(pendingAlbumsTable.userId, userId)));
  if (existing.length === 0) {
    console.log(`Album with id ${pendingAlbumId} not found in pending list for user ${userId}`);
    return;
  }

  await db
    .delete(pendingAlbumsTable)
    .where(
      and(
        eq(pendingAlbumsTable.id, pendingAlbumId),
        eq(pendingAlbumsTable.userId, userId)));
}