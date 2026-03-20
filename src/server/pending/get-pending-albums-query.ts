import { count, eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";
import type { Db } from "../infrastructure/db";

const PAGE_SIZE = 20;

export const getPendingAlbumsQuery = protectedProcedure
  .input(z.object({ 
      page: z.number().int().min(1).default(1) 
    }).default({ page: 1 }))
  .query((
    { ctx: { db, userId }, input: { page } }
  ) => 
    getPendingAlbums(db, userId, page)
  );

export const getPendingAlbums = async (db: Db, userId: string, page: number) => {
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
  const total = Number(totalRow?.count ?? 0);
  return { items, total, page, pageSize: PAGE_SIZE };
}