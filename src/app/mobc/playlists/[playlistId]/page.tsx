import { api } from "~/utils/trpc/server";
import { SmallAlbumPlayer } from "../../albums/_components/player/SmallAlbumPlayer";
import GoToAlbumBtn from "../../albums/GoToAlbumBtn";
import { DeletePlaylistBtn } from "../DeletePlaylistBtn";
import RemoveFromPlaylistButton from "./RemoveFromPlaylistButton";
import UpdatePlaylistNameButton from "./UpdatePlaylistNameButton";

export default async function PlaylistPage({
  params
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;
  const playlist = await api.playlists.get({ id: playlistId });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <div className="flex items-center gap-2">
          <UpdatePlaylistNameButton playlistId={playlist.id} currentName={playlist.name} />
          <DeletePlaylistBtn playlistId={playlist.id} />
        </div>
      </div>

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

const PlaylistAlbumsList = ({
  playlist,
}: {
  playlist: Awaited<ReturnType<typeof api.playlists.get>>;
}) => {
  return (
    <div>
      <p className="mb-6 text-sm font-medium text-gray-600">
        {playlist.items.length} album{playlist.items.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {playlist.items.map((item) => (
          <PlaylistAlbumCard
            key={item.id}
            playlistId={playlist.id}
            albumId={item.albumId}
            albumUrl={item.albumUrl}
          />
        ))}
      </div>
    </div>
  );
};

const PlaylistAlbumCard = ({
  playlistId,
  albumId,
  albumUrl,
}: {
  playlistId: string;
  albumId: string;
  albumUrl: string;
}) => {
  return (
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl">
      <SmallAlbumPlayer albumId={albumId} />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <GoToAlbumBtn albumId={albumId} albumUrl={albumUrl} />
          <RemoveFromPlaylistButton playlistId={playlistId} albumId={albumId} />
        </div>
      </div>
    </div>
  );
};