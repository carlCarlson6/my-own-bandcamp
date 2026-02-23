import { api } from "~/utils/trpc/server";
import BigAlbumPlayer from "../BigAlbumPlayer";
import AlbumListsActions from "../AlbumListsActions";
import AlbumRecommendationsSection from "../AlbumRecommendationsSection";
import z from "zod";

export default async function AlbumPage({
  params
}: {
  params: Promise<{ albumData: string }>;
}) {
  const { albumData } = await params;
  const { albumId, albumUrl } = z.object({
    albumId: z.string(),
    albumUrl: z.string()
  }).parse(JSON.parse(Buffer.from(decodeURIComponent(albumData), 'base64').toString('utf-8')));

  const inspectResult =  await api.albums.inspect({ albumUrl });
  const albumLists = await api.albums.getLists({ albumId });

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <BigAlbumPlayer albumId={albumId} />
      <div className="flex flex-col gap-6 w-full lg:w-auto">
        <AlbumListsActions
          id={albumId}
          url={albumUrl}
          initialOnPending={albumLists.onPending}
          initialOnFavorites={albumLists.onFavorites}
          initialOnListened={albumLists.onListened}
        />
        {inspectResult.recomendations && inspectResult.recomendations.length > 0 && (
          <AlbumRecommendationsSection recommendations={inspectResult.recomendations} />
        )}
      </div>
    </div>
  );
}