import { createTRPCRouter } from "../infrastructure/trpc";
import { createPlaylistMutation } from "./create-playlist-mutation";
import { getPlaylistQuery } from "./get-playlist.query";
import { getPlaylistsResumeQuery } from "./get-playlists-resume-query";

export const playlistsRouter = createTRPCRouter({
  create:    createPlaylistMutation,
  getResume: getPlaylistsResumeQuery,
  get:       getPlaylistQuery,
});