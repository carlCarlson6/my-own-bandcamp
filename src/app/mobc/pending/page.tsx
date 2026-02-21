import { api } from "~/utils/trpc/server";

export default async function PendingAlbumsPage() {
  const albums = await api.getPendingAlbums();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pending Albums</h1>
      
      {albums.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center text-gray-600">
          No pending albums yet. Start adding albums from the search page!
        </div>
      ) : (
        <div>
          <p className="mb-6 text-sm font-medium text-gray-600">
            {albums.length} album{albums.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {albums.map((album) => (
              <PendingAlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type PendingAlbum = {
  id: string;
  userId: string;
  title: string;
  artist: string;
  imageUrl: string;
};

const PendingAlbumCard = ({ album }: { album: PendingAlbum }) => {
  return (
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl">
      {album.imageUrl && (
        <img
          src={album.imageUrl}
          alt={album.title}
          className="h-80 w-full object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="truncate font-semibold text-gray-900">
          {album.title}
        </h3>
        <p className="truncate text-sm text-gray-600">
          {album.artist}
        </p>
      </div>
    </div>
  );
}