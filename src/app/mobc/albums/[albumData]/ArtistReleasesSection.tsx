"use client";

import { useState } from "react";
import { api } from "~/utils/trpc/react";
import { SmallAlbumPlayer } from "../_components/player/SmallAlbumPlayer";
import GoToAlbumBtn from "../GoToAlbumBtn";

type Release = {
  id: string;
  url: string;
};

type ArtistReleasesSectionProps = {
  releases: Release[];
  sourceType: "artist" | "label";
};

const ArtistReleasesSection = ({ releases, sourceType }: ArtistReleasesSectionProps) => {
  if (releases.length === 0) {
    return null;
  }

  const sectionTitle = sourceType === "label" ? "More from this label" : "More from this artist";

  return (
    <aside className="w-full rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">{sectionTitle}</h2>
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
        <SaveReleaseBtn albumId={albumId} url={url} />
        <GoToAlbumBtn albumId={albumId} albumUrl={url} />
      </div>
    </div>
  );
};

const SaveReleaseBtn = ({
  albumId,
  url,
}: {
  albumId: string;
  url: string;
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const { mutate, isPending, isError } = api.pending.save.useMutation({
    onSuccess() {
      setIsSaved(true);
    },
  });

  const execute = () =>
    mutate({
      album: {
        id: albumId,
        url: url,
      },
    });

  return (
    <>
    <button
      className="flex items-center justify-center gap-1 rounded-md px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={isSaved ? "Album saved" : "Add album to pending list"}
      aria-busy={isPending}
      onClick={execute}
      disabled={isPending || isSaved}
    >
      {isPending ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4 animate-spin"
        >
          <circle cx="12" cy="12" r="9" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      )}
      {isSaved ? "Saved" : "Add to pending"}
    </button>
    {isError && (
      <p className="mt-1 text-sm text-red-600" role="alert">
        Failed to save album. Please try again.
      </p>
    )}
    </>
  );
};

export default ArtistReleasesSection;
