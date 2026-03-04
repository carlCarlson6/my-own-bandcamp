import { createTRPCRouter } from "../infrastructure/trpc";
import { getAlbumListsQuery } from "./get-album-lists-query";
import { getAlumbsResumeQuery } from "./get-albums-resume-query";
import { searchAlbumsQuery } from "./search-albums-query";
import { inspectAlbumQuery } from "./inspect-album-query";
import { getArtistReleasesQuery } from "./get-artist-releases-query";
import { importFromBandcampMutation } from "./import-from-bandcamp-mutation";

export const albumsRouter = createTRPCRouter({
  getLists:             getAlbumListsQuery,
  getResume:            getAlumbsResumeQuery,
  search:               searchAlbumsQuery,
  inspect:              inspectAlbumQuery,
  getArtistReleases:    getArtistReleasesQuery,
  importFromBandcamp:   importFromBandcampMutation,
});