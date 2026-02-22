import type { api } from "~/utils/trpc/server";
import { SmallAlbumPlayer } from "../albums/SmallAlbumPlayer";
import DeleteFavoriteAlbumButton from "./DeleteFavoriteAlbumButton";
import GoToAlbumBtn from "../albums/GoToAlbumBtn";

const FavoritesAlbumsList = ({
  albums,
}: {
  albums: Awaited<ReturnType<typeof api.favorites.getAll>>;
}) => {
  return (
    <div>
      <p className="mb-6 text-sm font-medium text-gray-600">
        {albums.length} album{albums.length !== 1 ? "s" : ""}
      </p>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {albums.map((album) => (
          <FavoritesAlbumCard key={album.id} albumId={album.id} />
        ))}
      </div>
    </div>
  );
};

const FavoritesAlbumCard = ({ albumId }: { albumId: string }) => {
  return (
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl">
      <SmallAlbumPlayer albumId={albumId} />

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <GoToAlbumBtn albumId={albumId} />
          <DeleteFavoriteAlbumButton albumId={albumId} />
        </div>
      </div>
    </div>
  );
};

export default FavoritesAlbumsList;
