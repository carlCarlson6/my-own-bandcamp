import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildPlaylistItemId, playlistAlbumsTable, userPlaylistsTable } from "./playlists.schema";
import { eq } from "drizzle-orm";

export const ramoveFromPlaylistMutation = protectedProcedure
  .input(z.object({
    playlistId: z.string(),
    albumId: z.string(),
  }))
  .mutation(async ({ ctx: { userId, db }, input: { playlistId, albumId } }) => {
    const toDeleteItem = (await db
      .select()
      .from(playlistAlbumsTable)
      .where(
        eq(
          playlistAlbumsTable.id, 
          buildPlaylistItemId({ playlistId, albumId, userId }))
      )
      .limit(1))
      .at(0);
    if (!toDeleteItem) return;

    const result = await db      
      .delete(playlistAlbumsTable)
      .where(eq(playlistAlbumsTable.id, toDeleteItem.id));

    if (result.count !== 1) {
      throw new Error("Failed to remove album from playlist");
    }
  });