import { api } from "~/utils/trpc/server";
import PlaylistAlbumsList from "./PlaylistAlbumsList";

export default async function PlaylistPage({
  params
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;
  const playlist = await api.playlists.get({ id: playlistId });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{playlist.name}</h1>

      {playlist.items.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center text-gray-600">
          No albums in this playlist yet.
        </div>
      ) : (
        <PlaylistAlbumsList playlist={playlist} />
      )}
    </div>
  );
}