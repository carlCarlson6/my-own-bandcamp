import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { userPlaylistsTable } from "./playlists.schema";
import { and, eq } from "drizzle-orm";

export const getPlaylistQuery = protectedProcedure
  .input(z.object({
    id: z.string()
  }))
  .query(async ({ ctx: { db, userId }, input: { id } }) => {
    const userPlaylistCheck = await db
      .select()
      .from(userPlaylistsTable)
      .where(and(
        eq(userPlaylistsTable.userId, userId),
        eq(userPlaylistsTable.id, id)
      ))
      .limit(1);
    if (userPlaylistCheck.length === 0) throw new Error("Playlist not found or access denied");

    return {};
  });