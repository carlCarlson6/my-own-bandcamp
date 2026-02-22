"use client";

import { useState } from "react";
import { api } from "~/utils/trpc/react";

type AlbumListsActionsProps = {
  albumId: string;
  initialOnPending: boolean;
  initialOnFavorites: boolean;
  initialOnListened: boolean;
};

const AlbumListsActions = ({
  albumId,
  initialOnPending,
  initialOnFavorites,
  initialOnListened,
}: AlbumListsActionsProps) => {
  const [onPending, setOnPending] = useState(initialOnPending);
  const [onFavorites, setOnFavorites] = useState(initialOnFavorites);
  const [onListened, setOnListened] = useState(initialOnListened);

  const savePending = api.pending.save.useMutation({
    onSuccess() {
      setOnPending(true);
    },
  });
  const removePending = api.pending.remove.useMutation({
    onSuccess() {
      setOnPending(false);
    },
  });

  const saveFavorites = api.favorites.save.useMutation({
    onSuccess() {
      setOnFavorites(true);
    },
  });
  const removeFavorites = api.favorites.remove.useMutation({
    onSuccess() {
      setOnFavorites(false);
    },
  });

  const saveListened = api.listened.save.useMutation({
    onSuccess() {
      setOnListened(true);
    },
  });
  const removeListened = api.listened.remove.useMutation({
    onSuccess() {
      setOnListened(false);
    },
  });

  const handlePendingChange = (checked: boolean) => {
    if (checked) {
      setOnPending(true);
      savePending.mutate(
        { album: { id: albumId } },
        { onError: () => setOnPending(false) },
      );
      return;
    }
    setOnPending(false);
    removePending.mutate({ albumId }, { onError: () => setOnPending(true) });
  };

  const handleFavoritesChange = (checked: boolean) => {
    if (checked) {
      setOnFavorites(true);
      saveFavorites.mutate({ albumId }, { onError: () => setOnFavorites(false) });
      return;
    }
    setOnFavorites(false);
    removeFavorites.mutate({ albumId }, { onError: () => setOnFavorites(true) });
  };

  const handleListenedChange = (checked: boolean) => {
    if (checked) {
      setOnListened(true);
      saveListened.mutate({ albumId }, { onError: () => setOnListened(false) });
      return;
    }
    setOnListened(false);
    removeListened.mutate({ albumId }, { onError: () => setOnListened(true) });
  };

  return (
    <aside className="w-full max-w-sm rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Album lists</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {savePending.isPending || removePending.isPending ? (
            <div className="flex items-center gap-2 text-sm text-gray-700">
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
              Pending list
            </div>
          ) : (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={onPending}
                onChange={(event) => handlePendingChange(event.target.checked)}
              />
              Pending list
            </label>
          )}
          <span className="text-xs text-gray-500">
            {savePending.isPending || removePending.isPending ? "Updating..." : ""}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {saveFavorites.isPending || removeFavorites.isPending ? (
            <div className="flex items-center gap-2 text-sm text-gray-700">
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
              Favorites
            </div>
          ) : (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={onFavorites}
                onChange={(event) => handleFavoritesChange(event.target.checked)}
              />
              Favorites
            </label>
          )}
          <span className="text-xs text-gray-500">
            {saveFavorites.isPending || removeFavorites.isPending
              ? "Updating..."
              : ""}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {saveListened.isPending || removeListened.isPending ? (
            <div className="flex items-center gap-2 text-sm text-gray-700">
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
              Listened
            </div>
          ) : (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={onListened}
                onChange={(event) => handleListenedChange(event.target.checked)}
              />
              Listened
            </label>
          )}
          <span className="text-xs text-gray-500">
            {saveListened.isPending || removeListened.isPending
              ? "Updating..."
              : ""}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default AlbumListsActions;
