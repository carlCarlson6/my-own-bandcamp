import { count, eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { favoritesAlbumsTable } from "./favoritesAlbums.schema";

const PAGE_SIZE = 20;

export const getFavoriteAlbumsQuery = protectedProcedure
  .input(z.object({ page: z.number().int().min(1).default(1) }).default({}))
  .query(async ({ ctx: { db, userId }, input: { page } }) => {
    const [items, [totalRow]] = await Promise.all([
      db
        .select({
          id:   favoritesAlbumsTable.id,
          bcId: favoritesAlbumsTable.albumId,
          url:  favoritesAlbumsTable.albumUrl,
        })
        .from(favoritesAlbumsTable)
        .where(eq(favoritesAlbumsTable.userId, userId))
        .orderBy(favoritesAlbumsTable.addedAt)
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
      db
        .select({ count: count() })
        .from(favoritesAlbumsTable)
        .where(eq(favoritesAlbumsTable.userId, userId)),
    ]);
    return { items, total: totalRow?.count ?? 0, page, pageSize: PAGE_SIZE };
  });