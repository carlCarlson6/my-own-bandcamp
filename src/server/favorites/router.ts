import { createTRPCRouter } from "../infrastructure/trpc/trpc";
import { removeAlbumFromFavoritesMutation } from "./remove-from-favorites-mutation";

export const favoritesRouter = createTRPCRouter({
  remove: removeAlbumFromFavoritesMutation,
});