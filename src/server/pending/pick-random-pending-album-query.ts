import { sql, eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";
import type { Db } from "../infrastructure/db";

export const pickRandomPendingAlbumQuery = protectedProcedure
  .query(({ ctx: { userId, db } }) => 
    pickRandomPendingAlbum(db, userId)
  );

export const pickRandomPendingAlbum = async (db: Db, userId: string) => {
  const result = await db
    .select({ 
      id: pendingAlbumsTable.albumId,
      url: pendingAlbumsTable.albumUrl,
    })
    .from(pendingAlbumsTable)
    .where(eq(pendingAlbumsTable.userId, userId))
    .orderBy(sql`random()`)
    .limit(1);
  return result.at(0) ?? "no-pending-albums" as const;
}