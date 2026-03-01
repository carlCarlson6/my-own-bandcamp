import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildListenedAlbumId, listenedAlbumsTable } from "./listenedAlbums.schema";
import { eq } from "drizzle-orm";

export const saveToListenedMutation = protectedProcedure
  .input(z.object({ 
    id: z.string().min(1),
    url: z.string().min(1).url()
  }))
  .mutation(async ({ input: { id, url }, ctx: { db, userId } }) => {
    const existing = await db.select()
      .from(listenedAlbumsTable)
      .where(
        eq(listenedAlbumsTable.id, buildListenedAlbumId(id, userId))
      );
    if (existing.length > 0) return;

    await db
      .insert(listenedAlbumsTable)
      .values({
        id:       buildListenedAlbumId(id, userId),
        albumId:  id,
        albumUrl: url,
        userId:   userId
      });
  });