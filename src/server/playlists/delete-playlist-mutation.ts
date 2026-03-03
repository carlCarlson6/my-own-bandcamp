import z from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../infrastructure/trpc";
import { userPlaylistsTable } from "./playlists.schema";
import { and, eq } from "drizzle-orm";

export const deletePlaylistMutation = protectedProcedure
  .input(z.object({ playlistId: z.string() }))
  .mutation(async ({ ctx: { userId, db }, input: { playlistId } }) => {
    const result = await db
      .delete(userPlaylistsTable)
      .where(and(eq(userPlaylistsTable.id, playlistId), eq(userPlaylistsTable.userId, userId)));

    if (result.count === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
    }
  });
