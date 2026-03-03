import { api } from "~/utils/trpc/server";
import PickRandomPendingAlbumBtn from "./PickRandomAlbumBtn";
import { AlbumsListDisplay } from "../albums/_components/display/AlbumsDisplay";

export default async function PendingAlbumsPage() {
  const albums = await api.pending.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-cyber-text">Pending Albums</h1>
        <PickRandomPendingAlbumBtn />
      </div>
      
      {albums.length === 0 ? (
        <div className="rounded-md border border-cyber-border bg-cyber-surface p-8 text-center text-cyber-muted">
          No pending albums yet. Start adding albums from the search page!
        </div>
      ) : (
        <AlbumsListDisplay albums={albums} />
      )}
    </div>
  );
}

