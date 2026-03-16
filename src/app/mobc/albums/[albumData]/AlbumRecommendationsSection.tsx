"use client";

import { SmallAlbumPlayer } from "../_components/player/SmallAlbumPlayer";
import SaveAlbumBtn from "../_components/SaveAlbumBtn";
import GoToAlbumBtn from "../GoToAlbumBtn";

type Recommendation = {
  id: string;
  url: string;
};

type AlbumRecommendationsSectionProps = {
  recommendations: Recommendation[];
};

const AlbumRecommendationsSection = ({
  recommendations,
}: AlbumRecommendationsSectionProps) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <aside className="w-full rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Recommendations</h2>
      <div className="grid grid-cols-2 gap-3">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            albumId={recommendation.id}
            url={recommendation.url}
          />
        ))}
      </div>
    </aside>
  );
};

const RecommendationCard = ({
  albumId,
  url,
}: {
  albumId: string;
  url: string;
}) => {
  return (
    <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
      <SmallAlbumPlayer albumId={albumId} />
      <div className="p-2 flex flex-col items-center gap-1">
        <SaveAlbumBtn albumId={albumId} url={url} />
        <GoToAlbumBtn albumId={albumId} albumUrl={url} />
      </div>
    </div>
  );
};

export default AlbumRecommendationsSection;

