import { createTRPCRouter } from "../infrastructure/trpc";
import { getListenedAlbumsQuery } from "./get-listened-albums-query";
import { saveToListenedMutation } from "./save-to-listened-mutation";
import { removeAlbumFromListenedMutation } from "./remove-from-listened-mutation";

export const listenedRouter = createTRPCRouter({
  getAll: getListenedAlbumsQuery, // TODO refactor extract use case for testing
  save:   saveToListenedMutation, // TODO refactor extract use case for testing
  remove: removeAlbumFromListenedMutation, // TODO refactor extract use case for testing
});