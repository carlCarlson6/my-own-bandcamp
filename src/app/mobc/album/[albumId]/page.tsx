import { api } from "~/utils/trpc/server";
import BigAlbumPlayer from "../BigAlbumPlayer";
import AlbumListActions from "../AlbumListActions";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ albumId: string }>
}) {
  const { albumId } = await params;
  const albumLists = await api.getAlbumLists({ albumId });

  console.log("Album lists containing this album:", albumLists);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <BigAlbumPlayer albumId={albumId} />

      <AlbumListActions
        albumId={albumId}
        initialOnPending={albumLists.onPending}
        initialOnFavorites={albumLists.onFavorites}
      />
    </div>
  );
}