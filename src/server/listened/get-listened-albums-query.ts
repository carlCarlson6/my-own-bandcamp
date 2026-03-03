import { eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc";
import { listenedAlbumsTable } from "./listenedAlbums.schema";

export const getListenedAlbumsQuery = protectedProcedure
  .query(async (
    { ctx: { db, userId } }
  ) => db
    .select({
      id:   listenedAlbumsTable.id,
      bcId: listenedAlbumsTable.albumId,
      url:  listenedAlbumsTable.albumUrl,
    })
    .from(listenedAlbumsTable)
    .where(eq(listenedAlbumsTable.userId, userId))
    .orderBy(listenedAlbumsTable.addedAt));