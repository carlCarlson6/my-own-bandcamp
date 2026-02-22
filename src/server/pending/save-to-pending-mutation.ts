import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { buildPendingAlbumId, pendingAlbumsTable } from "./pendingAlbums.schema";
import { and, eq } from "drizzle-orm";

export const saveToPendingMutation = protectedProcedure
  .input(z.object({
    album: z.object({
      id: z.string().min(1),
  })}))
  .mutation(async ({ ctx: { userId, db }, input: { album } }) => {
    const existing = await db.select()
      .from(pendingAlbumsTable)
      .where(
        and(
          eq(pendingAlbumsTable.userId, userId),
          eq(pendingAlbumsTable.albumId, album.id)
        )
      );
    if (existing.length > 0) {
      return;
    }

    await db.insert(pendingAlbumsTable).values({
      id:       buildPendingAlbumId(album.id, userId),
      albumId:  album.id,
      userId:   userId
    });
  });