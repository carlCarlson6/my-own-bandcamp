import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { playlistAlbumsTable, userPlaylistsTable } from "./playlists.schema";
import { and, eq } from "drizzle-orm";

export const ramoveFromPlaylistMutation = protectedProcedure
  .input(z.object({
    playlistId: z.string(),
    listItemId:    z.string(),
  }))
  .mutation(async ({ ctx: { userId, db }, input: { playlistId, listItemId } }) => {
    const toDeleteItem = (await db
      .select()
      .from(playlistAlbumsTable)
      .where(
        and(
          eq(playlistAlbumsTable.playlistId, playlistId),
          eq(playlistAlbumsTable.id, listItemId),
          eq(playlistAlbumsTable.userId, userId)
        )
      )
      .limit(1))
      .at(0);
    if (!toDeleteItem) return;

    const result = await db      
      .delete(playlistAlbumsTable)
      .where(eq(playlistAlbumsTable.id, listItemId));

    if (result.count !== 1) {
      throw new Error("Failed to remove album from playlist");
    }
  });