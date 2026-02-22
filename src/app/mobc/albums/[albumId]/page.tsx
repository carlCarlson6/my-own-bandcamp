import { api } from "~/utils/trpc/server";
import BigAlbumPlayer from "../BigAlbumPlayer";
import AlbumListsActions from "../AlbumListsActions";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ albumId: string }>
}) {
  const { albumId } = await params;
  const albumLists = await api.albums.getLists({ albumId });

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <BigAlbumPlayer albumId={albumId} />
      <AlbumListsActions
        albumId={albumId}
        initialOnPending={albumLists.onPending}
        initialOnFavorites={albumLists.onFavorites}
        initialOnListened={albumLists.onListened}
      />
    </div>
  );
}