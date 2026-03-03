import { createTRPCRouter } from "../infrastructure/trpc";
import { clearPendingMutation } from "./clear-pending-mutation";
import { getPendingAlbumsQuery } from "./get-pending-albums-query";
import { pickRandomPendingAlbumQuery } from "./pick-random-pending-album-query";
import { removeAlbumFromPendingMutation } from "./remove-from-pending-mutation";
import { saveToPendingMutation } from "./save-to-pending-mutation";

export const pendingRouter = createTRPCRouter({
  save:       saveToPendingMutation,
  remove:     removeAlbumFromPendingMutation,
  getAll:     getPendingAlbumsQuery,
  pickRandom: pickRandomPendingAlbumQuery,
  clearAll:   clearPendingMutation,
});