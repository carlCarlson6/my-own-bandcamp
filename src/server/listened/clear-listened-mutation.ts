import { protectedProcedure } from "../infrastructure/trpc";
import { listenedAlbumsTable } from "./listenedAlbums.schema";
import { eq } from "drizzle-orm";

export const clearListenedMutation = protectedProcedure
  .mutation(async ({ ctx: { db, userId } }) => {
    await db
      .delete(listenedAlbumsTable)
      .where(eq(listenedAlbumsTable.userId, userId));
  });
