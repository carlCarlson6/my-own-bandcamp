import { eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildListenedAlbumId, listenedAlbumsTable } from "./listenedAlbums.schema";
import z from "zod";

export const removeAlbumFromListenedMutation = protectedProcedure
  .input(z.object({ albumId: z.string().min(1) }))
  .mutation(async (
    { input: { albumId }, ctx: { db, userId } }
  ) => {
    const existing = await db
      .select()
      .from(listenedAlbumsTable)
      .where(
        eq(listenedAlbumsTable.id, buildListenedAlbumId(albumId, userId)));
    if (existing.length === 0) return;

    await db
      .delete(listenedAlbumsTable)
      .where(
        eq(listenedAlbumsTable.id, buildListenedAlbumId(albumId, userId)));
  });