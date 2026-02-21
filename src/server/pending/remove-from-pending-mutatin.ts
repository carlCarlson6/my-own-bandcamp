import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { pendingAlbums } from "./pendingAlbums.schema";
import { and, eq } from "drizzle-orm";

export const removeAlbumFromPendingMutation = protectedProcedure
  .input(z.object({ albumId: z.string() }))
  .mutation(async ({ input: { albumId }, ctx: { db, userId } }) => {
    await db.delete(pendingAlbums)
      .where(
        and(
          eq(pendingAlbums.id, albumId),
          eq(pendingAlbums.userId, userId)
        )
      );
  });