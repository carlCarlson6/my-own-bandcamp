import z from "zod";
import { count, eq, and } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { playlistAlbumsTable, userPlaylistsTable } from "./playlists.schema";

const PAGE_SIZE = 20;

export const getPlaylistQuery = protectedProcedure
  .input(z.object({
    id: z.string(),
    page: z.number().int().min(1).default(1),
  }))
  .query(async ({ ctx: { db, userId }, input: { id, page } }) => {
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

    const [items, [totalRow]] = await Promise.all([
      db.select()
        .from(playlistAlbumsTable)
        .where(eq(playlistAlbumsTable.playlistId, id))
        .orderBy(playlistAlbumsTable.addedAt)
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
      db
        .select({ count: count() })
        .from(playlistAlbumsTable)
        .where(eq(playlistAlbumsTable.playlistId, id)),
    ]);

    return {
      id,
      name: maybePlaylist.name,
      items,
      total: totalRow?.count ?? 0,
      page,
      pageSize: PAGE_SIZE,
    };
  });