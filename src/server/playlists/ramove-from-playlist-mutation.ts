import z from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../infrastructure/trpc";
import { playlistAlbumsTable, userPlaylistsTable } from "./playlists.schema";
import { and, eq } from "drizzle-orm";

export const ramoveFromPlaylistMutation = protectedProcedure
  .input(z.object({
    playlistId: z.string(),
    albumId: z.string(),
  }))
  .mutation(async ({ ctx: { userId, db }, input: { playlistId, albumId } }) => {
    const playlist = (await db
      .select()
      .from(userPlaylistsTable)
      .where(and(eq(userPlaylistsTable.id, playlistId), eq(userPlaylistsTable.userId, userId)))
      .limit(1))
      .at(0);
    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
    }

    const result = await db
      .delete(playlistAlbumsTable)
      .where(and(eq(playlistAlbumsTable.playlistId, playlistId), eq(playlistAlbumsTable.albumId, albumId)));

    if (result.count !== 1) {
      throw new Error("Failed to remove album from playlist");
    }
  });