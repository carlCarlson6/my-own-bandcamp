"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/utils/trpc/react";
import { encodeAlbumData } from "../albums/GoToAlbumBtn";

const PickRandomPendingAlbumBtn = ({ albumId }: { albumId?: string }) => {
  const router = useRouter();
  const [noAlbum, setNoAlbum] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { refetch, isFetching: isFetchingRandomAlbum } = api.pending.pickRandom.useQuery(undefined, {
    enabled: false,
  });
  const isLoading = isFetchingRandomAlbum || isNavigating;

  const handleClick = async () => {
    setNoAlbum(false);
    const result = await refetch();

    if (!result.data || result.data === "no-pending-albums") {
      setNoAlbum(true);
    } else if (result.data.id !== albumId) {
      setIsNavigating(true);
      router.push(`/mobc/albums/${encodeAlbumData({ albumId: result.data.id, albumUrl: result.data.url })}`);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleClick}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
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
        ) : null}
        Pick random pending album
      </button>
      {noAlbum ? (
        <p className="text-xs text-red-600">No albums on pending.</p>
      ) : null}
    </div>
  );
};

export default PickRandomPendingAlbumBtn;