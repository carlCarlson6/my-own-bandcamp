import type { api } from "~/utils/trpc/server";
import { SmallAlbumPlayer } from "../album/SmallAlbumPlayer";
import DeletePendingAlbumButton from "./DeletePedingAlbumButton";

const PendingAlbumsList = ({ albums }: { albums: Awaited<ReturnType<typeof api.getPendingAlbums>> }) => {
  return (
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
  );
}

const PendingAlbumCard = ({ album }: { album: Awaited<ReturnType<typeof api.getPendingAlbums>>[number] }) => {
  return (
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl">
      <SmallAlbumPlayer albumId={album.id} />

      <div className="p-4 flex flex-col gap-2">      
        <div className="flex items-center justify-between">
          <a href={`/mobc/album/${album.id}`} className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
            go to album
          </a>
         <DeletePendingAlbumButton albumId={album.id} />
        </div>

      </div>

    </div>
  );
}

export default PendingAlbumsList;