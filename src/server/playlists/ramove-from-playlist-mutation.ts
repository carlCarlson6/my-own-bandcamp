import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";

export const ramoveFromPlaylistMutation = protectedProcedure
  .input(z.object({
    playlistId: z.string(),
    id:         z.string(),
  }))
  .mutation(async ({ ctx }) => {});