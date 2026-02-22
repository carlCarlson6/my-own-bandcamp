import { api } from "~/utils/trpc/server";
import BigAlbumPlayer from "../BigAlbumPlayer";
import AlbumListsActions from "../AlbumListsActions";
import AlbumRecommendationsSection from "../AlbumRecommendationsSection";

export default async function AlbumPage({
  params, searchParams
}: {
  params: Promise<{ albumId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const albumUrl = (await searchParams).albumUrl as string;
  const inspectResult =  await api.albums.inspect(albumUrl);
  
  const { albumId } = await params;
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