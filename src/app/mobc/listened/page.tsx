import { api } from "~/utils/trpc/server";
import ListenedAlbumsList from "./ListenedAlbumsList";

export default async function ListenedPage() {
  const albums = await api.listened.getAll();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Listened Albums</h1>

      {albums.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center text-gray-600">
          No listened albums yet. Start adding albums from the search page!
        </div>
      ) : (
        <ListenedAlbumsList albums={albums} />
      )}
    </div>
  );
}