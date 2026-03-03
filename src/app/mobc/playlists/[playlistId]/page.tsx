import { api } from "~/utils/trpc/server";
import { SmallAlbumPlayer } from "../../albums/_components/player/SmallAlbumPlayer";
import GoToAlbumBtn from "../../albums/GoToAlbumBtn";
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
        <h1 className="text-2xl font-bold text-cyber-text">{playlist.name}</h1>
        <UpdatePlaylistNameButton playlistId={playlist.id} currentName={playlist.name} />
      </div>

      {playlist.items.length === 0 ? (
        <div className="rounded-md border border-cyber-border bg-cyber-surface p-8 text-center text-cyber-muted">
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
      <p className="mb-6 text-sm font-medium text-cyber-muted">
        {playlist.items.length} album{playlist.items.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {playlist.items.map((item) => (
          <PlaylistAlbumCard
            key={item.id}
            albumId={item.albumId}
            albumUrl={item.albumUrl}
          />
        ))}
      </div>
    </div>
  );
};

const PlaylistAlbumCard = ({
  albumId,
  albumUrl,
}: {
  albumId: string;
  albumUrl: string;
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-cyber-border bg-cyber-surface transition-shadow hover:shadow-[0_0_15px_var(--color-cyber-cyan)]">
      <SmallAlbumPlayer albumId={albumId} />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <GoToAlbumBtn albumId={albumId} albumUrl={albumUrl} />
        </div>
      </div>
    </div>
  );
};