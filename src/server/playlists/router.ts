import { createTRPCRouter } from "../infrastructure/trpc";
import { createPlaylistMutation } from "./create-playlist-mutation";
import { getPlaylistQuery } from "./get-playlist.query";
import { getPlaylistsResumeQuery } from "./get-playlists-resume-query";
import { ramoveFromPlaylistMutation } from "./ramove-from-playlist-mutation";
import { saveToPlaylistMutation } from "./save-to-playlist-mutation";

export const playlistsRouter = createTRPCRouter({
  create:    createPlaylistMutation,
  getResume: getPlaylistsResumeQuery,
  get:       getPlaylistQuery,
  save:      saveToPlaylistMutation,
  remove:    ramoveFromPlaylistMutation,
});