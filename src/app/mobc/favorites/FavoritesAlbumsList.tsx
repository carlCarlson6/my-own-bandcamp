import type { api } from "~/utils/trpc/server";
import { SmallAlbumPlayer } from "../albums/_components/player/SmallAlbumPlayer";
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
          <FavoritesAlbumCard key={album.id} id={album.id} url={album.url} />
        ))}
      </div>
    </div>
  );
};

const FavoritesAlbumCard = ({ id, url }: { id: string, url: string }) => {
  return (
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl">
      <SmallAlbumPlayer albumId={id} />

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <GoToAlbumBtn albumId={id} albumUrl={url} />
          <DeleteFavoriteAlbumButton albumId={id} />
        </div>
      </div>
    </div>
  );
};

export default FavoritesAlbumsList;
