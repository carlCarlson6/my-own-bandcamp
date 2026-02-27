import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { playlistAlbumsTable, userPlaylistsTable } from "./playlists.schema";
import { and, eq } from "drizzle-orm";

export const getPlaylistQuery = protectedProcedure
  .input(z.object({
    id: z.string()
  }))
  .query(async ({ ctx: { db, userId }, input: { id } }) => {
    const result = await db
      .select({
        name: userPlaylistsTable.name
      })
      .from(userPlaylistsTable)
      .where(and(
        eq(userPlaylistsTable.userId, userId),
        eq(userPlaylistsTable.id, id)
      ))
      .limit(1);
    const maybePlaylist = result.at(0);
    if (!maybePlaylist) throw new Error("Playlist not found or access denied");

    const almbus = await db.select()
      .from(playlistAlbumsTable)
      .where(eq(playlistAlbumsTable.playlistId, id))
      .orderBy(playlistAlbumsTable.addedAt);

    return {
      name: maybePlaylist.name,
      albums: almbus
    };
  });