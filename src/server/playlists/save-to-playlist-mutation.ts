import z from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildPlaylistItemId, playlistAlbumsTable, userPlaylistsTable } from "./playlists.schema";

export const saveToPlaylistMutation = protectedProcedure
  .input(z.object({
    album: z.object({
      id: z.string(),
      url: z.string().url()
    }),
    playlistId: z.string()
  }))
  .mutation(async ({ input: { album, playlistId }, ctx: { userId, db } }) => {
    const playlist = (await db
      .select()
      .from(userPlaylistsTable)
      .where(and(eq(userPlaylistsTable.id, playlistId), eq(userPlaylistsTable.userId, userId)))
      .limit(1))
      .at(0);
    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
    }

    await db.insert(playlistAlbumsTable).values({
      id: buildPlaylistItemId({
        playlistId,
        albumId: album.id,
        userId
      }),
      playlistId,
      albumId: album.id,
      albumUrl: album.url,
      userId
    });
  });