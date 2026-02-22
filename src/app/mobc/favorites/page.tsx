import { api } from "~/utils/trpc/server";
import FavoritesAlbumsList from "./FavoritesAlbumsList";

export default async function FavoritesPage() {
  const albums = await api.favorites.getAll();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Favorite Albums</h1>

      {albums.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center text-gray-600">
          No favorite albums yet. Start adding albums from the search page!
        </div>
      ) : (
        <FavoritesAlbumsList albums={albums} />
      )}
    </div>
  );
}