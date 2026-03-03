import { createTRPCRouter } from "../infrastructure/trpc";
import { getFavoriteAlbumsQuery } from "./get-favorite-albums-query";
import { removeAlbumFromFavoritesMutation } from "./remove-from-favorites-mutation";
import { saveToFavoritesMutation } from "./save-to-favorites-mutation";

export const favoritesRouter = createTRPCRouter({
  remove: removeAlbumFromFavoritesMutation,
  save:   saveToFavoritesMutation,
  getAll: getFavoriteAlbumsQuery,
});