import { count, eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { listenedAlbumsTable } from "./listenedAlbums.schema";

const PAGE_SIZE = 20;

export const getListenedAlbumsQuery = protectedProcedure
  .input(z.object({ page: z.number().int().min(1).default(1) }).default({}))
  .query(async ({ ctx: { db, userId }, input: { page } }) => {
    const [items, [totalRow]] = await Promise.all([
      db
        .select({
          id:   listenedAlbumsTable.id,
          bcId: listenedAlbumsTable.albumId,
          url:  listenedAlbumsTable.albumUrl,
        })
        .from(listenedAlbumsTable)
        .where(eq(listenedAlbumsTable.userId, userId))
        .orderBy(listenedAlbumsTable.addedAt)
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
      db
        .select({ count: count() })
        .from(listenedAlbumsTable)
        .where(eq(listenedAlbumsTable.userId, userId)),
    ]);
    return { items, total: totalRow ? Number(totalRow.count) : 0, page, pageSize: PAGE_SIZE };
  });