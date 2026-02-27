import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildPendingAlbumId, pendingAlbumsTable } from "./pendingAlbums.schema";
import { eq } from "drizzle-orm";

export const removeAlbumFromPendingMutation = protectedProcedure
  .input(z.object({ albumId: z.string() }))
  .mutation(async (
    { input: { albumId }, ctx: { db, userId } }
  ) => {
    const existing = await db
      .select()
      .from(pendingAlbumsTable)
      .where(
        eq(pendingAlbumsTable.id, buildPendingAlbumId(albumId, userId)));
    if (existing.length === 0) return;

    await db
      .delete(pendingAlbumsTable)
      .where(
        eq(pendingAlbumsTable.id, buildPendingAlbumId(albumId, userId)));
  });