import { sql, eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { pendingAlbumsTable } from "./pendingAlbums.schema";

export const pickRandomPendingAlbumQuery = protectedProcedure
  .query(async ({ ctx: { userId, db } }) => {
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
  });