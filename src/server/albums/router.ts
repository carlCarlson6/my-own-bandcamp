import { createTRPCRouter } from "../infrastructure/trpc/trpc";
import { getAlbumListsQuery } from "./get-album-lists-query";
import { getAlumbsResumeQuery } from "./get-albums-resume-query";
import { searchAlbumsQuery } from "./search-albums-query";
import { inspectAlbumQuery } from "./inspect-album-query";

export const albumsRouter = createTRPCRouter({
  getLists:   getAlbumListsQuery,
  getResume:  getAlumbsResumeQuery,
  search:     searchAlbumsQuery,
  inspect:    inspectAlbumQuery
});