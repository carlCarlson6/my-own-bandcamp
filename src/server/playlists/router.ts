import { createTRPCRouter } from "../infrastructure/trpc";
import { createPlaylistMutation } from "./create-playlist-mutation";
import { getPlaylistsResumeQuery } from "./get-playlists-resume-query";

export const playlistsRouter = createTRPCRouter({
  create:    createPlaylistMutation,
  getResume: getPlaylistsResumeQuery,
});