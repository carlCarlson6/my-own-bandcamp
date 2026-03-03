import { createTRPCRouter } from "../infrastructure/trpc";
import { createPlaylistMutation } from "./create-playlist-mutation";
import { deletePlaylistMutation } from "./delete-playlist-mutation";
import { getPlaylistQuery } from "./get-playlist.query";
import { getPlaylistsResumeQuery } from "./get-playlists-resume-query";
import { removeFromPlaylistMutation } from "./remove-from-playlist-mutation";
import { saveToPlaylistMutation } from "./save-to-playlist-mutation";
import { updatePlaylistNameMutation } from "./update-playlist-name-mutation";

export const playlistsRouter = createTRPCRouter({
  create:     createPlaylistMutation,
  delete:     deletePlaylistMutation,
  getResume:  getPlaylistsResumeQuery,
  get:        getPlaylistQuery,
  save:       saveToPlaylistMutation,
  remove:     removeFromPlaylistMutation,
  updateName: updatePlaylistNameMutation,
});