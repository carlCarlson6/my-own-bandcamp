import { api } from "~/utils/trpc/server";
import BigAlbumPlayer from "../_components/player/BigAlbumPlayer";
import AlbumListsActions from "./AlbumListsActions";
import z from "zod";
import AlbumRecommendationsSection from "./AlbumRecommendationsSection";
import ArtistReleasesSection from "./ArtistReleasesSection";
import PickRandomPendingAlbumBtn from "../../pending/PickRandomAlbumBtn";

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

  const [inspectResult, albumLists, artistReleases] = await Promise.all([
    api.albums.inspect({ albumUrl }),
    api.albums.getLists({ albumId }),
    api.albums.getArtistReleases({ albumUrl }),
  ]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <BigAlbumPlayer albumId={albumId} />
      <div className="flex flex-col gap-6 w-full lg:w-auto">
        <div className="flex justify-end">
          <PickRandomPendingAlbumBtn albumId={albumId} />
        </div>
        <AlbumListsActions
          albumId={albumId}
          url={albumUrl}
          initialOnPending={albumLists.onPending}
          initialOnFavorites={albumLists.onFavorites}
          initialOnListened={albumLists.onListened}
          initialOnUserLists={albumLists.onUserLists.map(x => ({
            playlistId: x.id,
            name: x.name,
            isOn: Boolean(x.isOn)
          }))}
        />
        {artistReleases && artistReleases.length > 0 && (
          <ArtistReleasesSection releases={artistReleases} />
        )}
        {inspectResult.recomendations && inspectResult.recomendations.length > 0 && (
          <AlbumRecommendationsSection recommendations={inspectResult.recomendations} />
        )}
      </div>
    </div>
  );
}