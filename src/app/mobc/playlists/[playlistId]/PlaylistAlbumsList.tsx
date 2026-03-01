import type { api } from "~/utils/trpc/server";
import { SmallAlbumPlayer } from "../../albums/player/SmallAlbumPlayer";
import GoToAlbumBtn from "../../albums/GoToAlbumBtn";

const PlaylistAlbumsList = ({
  albums,
}: {
  albums: Awaited<ReturnType<typeof api.playlists.get>>["albums"];
}) => {
  return (
    <div>
      <p className="mb-6 text-sm font-medium text-gray-600">
        {albums.length} album{albums.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {albums.map((album) => (
          <PlaylistAlbumCard
            key={album.id}
            albumId={album.albumId}
            albumUrl={album.albumUrl}
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
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl">
      <SmallAlbumPlayer albumId={albumId} />

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <GoToAlbumBtn albumId={albumId} albumUrl={albumUrl} />
        </div>
      </div>
    </div>
  );
};

export default PlaylistAlbumsList;