import { count, eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";

const PAGE_SIZE = 20;

export const getPendingAlbumsQuery = protectedProcedure
  .input(z.object({ page: z.number().int().min(1).default(1) }).default({}))
  .query(async ({ ctx: { db, userId }, input: { page } }) => {
    const [items, [totalRow]] = await Promise.all([
      db
        .select({
          id:   pendingAlbumsTable.id,
          bcId: pendingAlbumsTable.albumId,
          url:  pendingAlbumsTable.albumUrl,
        })
        .from(pendingAlbumsTable)
        .where(eq(pendingAlbumsTable.userId, userId))
        .orderBy(pendingAlbumsTable.addedAt)
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
      db
        .select({ count: count() })
        .from(pendingAlbumsTable)
        .where(eq(pendingAlbumsTable.userId, userId)),
    ]);
    return { items, total: totalRow?.count ?? 0, page, pageSize: PAGE_SIZE };
  });