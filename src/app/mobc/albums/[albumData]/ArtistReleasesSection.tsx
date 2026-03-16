"use client";

import { SmallAlbumPlayer } from "../_components/player/SmallAlbumPlayer";
import SaveAlbumBtn from "../_components/SaveAlbumBtn";
import GoToAlbumBtn from "../GoToAlbumBtn";

type Release = {
  id: string;
  url: string;
};

type ArtistReleasesSectionProps = {
  releases: Release[];
};

const ArtistReleasesSection = ({ releases }: ArtistReleasesSectionProps) => {
  if (releases.length === 0) {
    return null;
  }

  return (
    <aside className="w-full rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">More from this artist</h2>
      <div className="grid grid-cols-2 gap-3">
        {releases.map((release) => (
          <ArtistReleaseCard
            key={release.id}
            albumId={release.id}
            url={release.url}
          />
        ))}
      </div>
    </aside>
  );
};

const ArtistReleaseCard = ({
  albumId,
  url,
}: {
  albumId: string;
  url: string;
}) => {
  return (
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
      <SmallAlbumPlayer albumId={albumId} />
      <div className="flex flex-col items-center gap-1 p-2">
        <SaveAlbumBtn albumId={albumId} url={url} />
        <GoToAlbumBtn albumId={albumId} albumUrl={url} />
      </div>
    </div>
  );
};

export default ArtistReleasesSection;

