import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { buildPlaylistItemId, playlistAlbumsTable } from "./playlists.schema";
import { randomUUID } from "crypto";

export const saveToPlaylistMutation = protectedProcedure
  .input(z.object({
    album: z.object({
      id: z.string(),
      url: z.string().url()
    }),
    playlistId: z.string()
  }))
  .mutation(async ({ input: { album, playlistId }, ctx: { userId, db } }) => {
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