import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildPendingAlbumId, pendingAlbumsTable } from "./pendingAlbums.schema";
import { eq } from "drizzle-orm";

export const saveToPendingMutation = protectedProcedure
  .input(z.object({
    album: z.object({
      id:   z.string().min(1),
      url: z.string().min(1).url()
  })}))
  .mutation(async ({ ctx: { userId, db }, input: { album } }) => {
    const existing = await db.select()
      .from(pendingAlbumsTable)
      .where(
        eq(pendingAlbumsTable.id, buildPendingAlbumId(album.id, userId)));
    if (existing.length > 0) return undefined;

    const result = await db
      .insert(pendingAlbumsTable)
      .values({
        id:       buildPendingAlbumId(album.id, userId),
        albumId:  album.id,
        albumUrl: album.url,
        userId:   userId
      })
      .returning();
    return result.at(0)?.id;
  });