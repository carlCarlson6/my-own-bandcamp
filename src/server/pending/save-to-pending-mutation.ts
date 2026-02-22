import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { buildPendingAlbumId, pendingAlbumsTable } from "./pendingAlbums.schema";
import { eq } from "drizzle-orm";

export const saveToPendingMutation = protectedProcedure
  .input(z.object({
    album: z.object({
      id: z.string().min(1),
  })}))
  .mutation(async ({ ctx: { userId, db }, input: { album } }) => {
    const existing = await db.select()
      .from(pendingAlbumsTable)
      .where(
        eq(pendingAlbumsTable.id, buildPendingAlbumId(album.id, userId)));
    if (existing.length > 0) return;

    await db
      .insert(pendingAlbumsTable)
      .values({
        id:       buildPendingAlbumId(album.id, userId),
        albumId:  album.id,
        userId:   userId
      });
  });