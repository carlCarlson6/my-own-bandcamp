import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { buildPendingAlbumId, pendingAlbumsTable } from "./pendingAlbums.schema";
import { and, eq } from "drizzle-orm";

// TODO - check if if album is already in pending, if it is not finish process, if it is execute delete
export const removeAlbumFromPendingMutation = protectedProcedure
  .input(z.object({ albumId: z.string() }))
  .mutation(
    async ({ input: { albumId }, ctx: { db, userId } }
  ) => db
    .delete(pendingAlbumsTable)
    .where(
      eq(pendingAlbumsTable.id, buildPendingAlbumId(albumId, userId))));