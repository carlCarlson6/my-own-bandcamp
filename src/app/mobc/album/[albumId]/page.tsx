import { api } from "~/utils/trpc/server";
import BigAlbumPlayer from "../BigAlbumPlayer";
import AlbumListActions from "../AlbumListActions";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ albumId: string }>
}) {
  const { albumId } = await params;
  const albumLists = await api.albums.getLists({ albumId });

  return (
    <div className="flex flex-row gap-8 lg:flex-row lg:items-start">
      <BigAlbumPlayer albumId={albumId} />
    </div>
  );
}