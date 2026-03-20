import { createTRPCRouter } from "../infrastructure/trpc";
import { createPlaylistMutation } from "./create-playlist-mutation";
import { deletePlaylistMutation } from "./delete-playlist-mutation";
import { getPlaylistQuery } from "./get-playlist.query";
import { getPlaylistsResumeQuery } from "./get-playlists-resume-query";
import { removeFromPlaylistMutation } from "./remove-from-playlist-mutation";
import { saveToPlaylistMutation } from "./save-to-playlist-mutation";
import { updatePlaylistNameMutation } from "./update-playlist-name-mutation";

export const playlistsRouter = createTRPCRouter({
  create:     createPlaylistMutation, // TODO refactor extract use case for testing
  delete:     deletePlaylistMutation, // TODO refactor extract use case for testing
  getResume:  getPlaylistsResumeQuery, // TODO refactor extract use case for testing
  get:        getPlaylistQuery, // TODO refactor extract use case for testing
  save:       saveToPlaylistMutation, // TODO refactor extract use case for testing
  remove:     removeFromPlaylistMutation, // TODO refactor extract use case for testing
  updateName: updatePlaylistNameMutation, // TODO refactor extract use case for testing
});