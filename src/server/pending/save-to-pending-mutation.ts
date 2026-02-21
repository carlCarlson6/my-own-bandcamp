import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";
import { and, eq } from "drizzle-orm";

export const saveToPendingMutation = protectedProcedure
  .input(z.object({
    album: z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      artist: z.string().min(1),
      imageUrl: z.string().url(),
  })}))
  .mutation(async ({ ctx: { userId, db }, input: { album } }) => {
    const existing = await db.select()
      .from(pendingAlbumsTable)
      .where(
        and(
          eq(pendingAlbumsTable.userId, userId),
          eq(pendingAlbumsTable.id, album.id)
        )
      );
    if (existing.length > 0) {
      return;
    }

    await db.insert(pendingAlbumsTable).values({
      ...album,
      userId: userId
    });
  });