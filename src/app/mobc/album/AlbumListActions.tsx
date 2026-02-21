"use client";

import { useState } from "react";
import { api } from "~/utils/trpc/react";

type AlbumListActionsProps = {
  albumId: string;
  initialOnPending: boolean;
  initialOnFavorites: boolean;
};

const AlbumListActions = ({
  albumId,
  initialOnPending,
  initialOnFavorites,
}: AlbumListActionsProps) => {
  const [onPending, setOnPending] = useState(initialOnPending);
  const [onFavorites, setOnFavorites] = useState(initialOnFavorites);

  const removePending = api.removeAlbumFromPending.useMutation({
    onSuccess() {
      setOnPending(false);
    },
  });

  const removeFavorites = api.removeAlbumFromFavorites.useMutation({
    onSuccess() {
      setOnFavorites(false);
    },
  });

  return (
    <aside className="w-full max-w-sm rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Album status</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Pending list</span>
          <div className="flex items-center gap-2">
            <span
              className={
                "rounded-full px-2 py-1 text-xs " +
                (onPending
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600")
              }
            >
              {onPending ? "Yes" : "No"}
            </span>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => removePending.mutate({ albumId })}
              disabled={!onPending || removePending.isPending}
              aria-busy={removePending.isPending}
            >
              {removePending.isPending ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Favorites</span>
          <div className="flex items-center gap-2">
            <span
              className={
                "rounded-full px-2 py-1 text-xs " +
                (onFavorites
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600")
              }
            >
              {onFavorites ? "Yes" : "No"}
            </span>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => removeFavorites.mutate({ albumId })}
              disabled={!onFavorites || removeFavorites.isPending}
              aria-busy={removeFavorites.isPending}
            >
              {removeFavorites.isPending ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AlbumListActions;
