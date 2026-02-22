import { createTRPCRouter } from "../infrastructure/trpc/trpc";
import { getAlbumListsQuery } from "./get-album-lists-query";
import { getAlumbsResumeQuery } from "./get-albums-resume-query";

export const albumsRouter = createTRPCRouter({
  getLists: getAlbumListsQuery,
  getResume: getAlumbsResumeQuery,
});