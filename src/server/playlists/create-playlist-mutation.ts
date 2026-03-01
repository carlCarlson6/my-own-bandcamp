import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import { userPlaylistsTable } from "./playlists.schema";

export const createPlaylistMutation = protectedProcedure
  .input(z.object({
    name: z.string(),
  }))
  .mutation(async (
    { ctx: { db, userId }, input }
  ) => db
    .insert(userPlaylistsTable)
    .values({
      id: crypto.randomUUID(),
      name: input.name,
      userId,
    })
  );