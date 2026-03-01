import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { userPlaylistsTable } from "./playlists.schema";
import { and, eq } from "drizzle-orm";

export const updatePlaylistNameMutation = protectedProcedure
  .input(z.object({
    playlistId: z.string(),
    newName: z.string().min(1).max(1000)
  }))
  .mutation(async ({ ctx: { db, userId }, input: { playlistId, newName }, }) => {
    const playlist = (await db
      .select({
        id: userPlaylistsTable.id
      })
      .from(userPlaylistsTable)
      .where(
        and(
          eq(userPlaylistsTable.id, playlistId),
          eq(userPlaylistsTable.userId, userId)
        )
      ))
      .at(0);
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    const result = await db
      .update(userPlaylistsTable)
      .set({ name: newName })
      .where(
        and(
          eq(userPlaylistsTable.id, playlistId),
          eq(userPlaylistsTable.userId, userId)
        )
      );
    if (result.count !== 1) {
      throw new Error("Failed to update playlist name");
    }
  });