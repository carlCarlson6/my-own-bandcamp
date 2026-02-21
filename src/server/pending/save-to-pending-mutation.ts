import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc/trpc";
import { pendingAlbums } from "./pendingAlbums.schema";

export const saveToPendingMutation = protectedProcedure
  .input(z.object({
    album: z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      artist: z.string().min(1),
      imageUrl: z.string().url(),
  })}))
  .mutation(async ({ ctx: { userId, db }, input: { album } }) => {
    return await db.insert(pendingAlbums).values({
      ...album,
      userId: userId
    });
  });