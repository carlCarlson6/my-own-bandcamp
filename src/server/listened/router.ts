import { createTRPCRouter } from "../infrastructure/trpc";
import { clearListenedMutation } from "./clear-listened-mutation";
import { getListenedAlbumsQuery } from "./get-listened-albums-query";
import { saveToListenedMutation } from "./save-to-listened-mutation";
import { removeAlbumFromListenedMutation } from "./remove-from-listened-mutation";

export const listenedRouter = createTRPCRouter({
  getAll:   getListenedAlbumsQuery,
  save:     saveToListenedMutation,
  remove:   removeAlbumFromListenedMutation,
  clearAll: clearListenedMutation,
});