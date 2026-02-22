import { createTRPCRouter } from "../infrastructure/trpc/trpc";
import { getAlbumListsQuery } from "./get-album-lists-query";

export const albumsRouter = createTRPCRouter({
  getLists: getAlbumListsQuery,
});