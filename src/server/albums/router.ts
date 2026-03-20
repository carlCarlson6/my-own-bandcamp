import { createTRPCRouter } from "../infrastructure/trpc";
import { getAlbumListsQuery } from "./get-album-lists-query";
import { getAlumbsResumeQuery } from "./get-albums-resume-query";
import { searchAlbumsQuery } from "./search-albums-query";
import { inspectAlbumQuery } from "./inspect-album-query";
import { getArtistReleasesQuery } from "./get-artist-releases-query";

export const albumsRouter = createTRPCRouter({
  getLists:             getAlbumListsQuery,
  getResume:            getAlumbsResumeQuery,
  search:               searchAlbumsQuery, // TODO refactor extract use case for testing
  inspect:              inspectAlbumQuery, // TODO refactor extract use case for testing
  getArtistReleases:    getArtistReleasesQuery, // TODO refactor extract use case for testing
});