import type { api } from "~/utils/trpc/server";
import { SmallAlbumPlayer } from "../album/SmallAlbumPlayer";
import DeletePendingAlbumButton from "./DeletePedingAlbumButton";

const PendingAlbumsList = ({ albums }: { albums: Awaited<ReturnType<typeof api.pending.getAll>> }) => {
  return (
    <div>
      <p className="mb-6 text-sm font-medium text-gray-600">
        {albums.length} album{albums.length !== 1 ? "s" : ""}
      </p>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {albums.map((album) => (
          <PendingAlbumCard key={album.id} albumId={album.id} />
        ))}
      </div>
    </div>
  );
}

const PendingAlbumCard = ({ albumId }: { albumId: string }) => {
  return (
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl">
      <SmallAlbumPlayer albumId={albumId} />

      <div className="p-4 flex flex-col gap-2">      
        <div className="flex items-center justify-between">
          <a href={`/mobc/album/${albumId}`} className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
            go to album
          </a>
         <DeletePendingAlbumButton albumId={albumId} />
        </div>

      </div>

    </div>
  );
}

export default PendingAlbumsList;