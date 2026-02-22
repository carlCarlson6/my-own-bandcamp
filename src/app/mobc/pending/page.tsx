import { api } from "~/utils/trpc/server";
import PendingAlbumsList from "./PendingAlbumsList";

export default async function PendingAlbumsPage() {
  const albums = await api.pending.getAll();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pending Albums</h1>
      
      {albums.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center text-gray-600">
          No pending albums yet. Start adding albums from the search page!
        </div>
      ) : (
        <PendingAlbumsList albums={albums} />
      )}
    </div>
  );
}

