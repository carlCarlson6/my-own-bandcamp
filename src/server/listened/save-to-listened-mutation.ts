import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { buildListenedAlbumId, listenedAlbumsTable } from "./listenedAlbums.schema";
import { eq } from "drizzle-orm";

export const saveToListenedMutation = protectedProcedure
  .input(z.object({ albumId: z.string() }))
  .mutation(async ({ input: { albumId }, ctx: { db, userId } }) => {
    const existing = await db.select()
      .from(listenedAlbumsTable)
      .where(
        eq(listenedAlbumsTable.id, buildListenedAlbumId(albumId, userId))
      );
    if (existing.length > 0) return;

    await db
      .insert(listenedAlbumsTable)
      .values({
        id:       buildListenedAlbumId(albumId, userId),
        albumId:  albumId,
        userId:   userId
      });
  });