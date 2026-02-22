import { eq } from "drizzle-orm";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { listenedAlbumsTable } from "./listenedAlbums.schema";

export const getListenedAlbumsQuery = protectedProcedure
  .query(async (
    { ctx: { db, userId } }
  ) => db
    .select({
      id: listenedAlbumsTable.albumId,
    })
    .from(listenedAlbumsTable)
    .where(eq(listenedAlbumsTable.userId, userId))
    .orderBy(listenedAlbumsTable.addedAt));