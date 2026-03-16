"use client";

import { useState } from "react";
import { api } from "~/utils/trpc/react";
import { useErrorAlert } from "../../_components/ErrorAlert";

type AlbumListsActionsProps = {
  albumId: string;
  url: string;
  initialOnPending?: string;
  initialOnFavorites?: string;
  initialOnListened?: string;
  initialOnUserLists: {
    playlistId: string;
    name: string;
    isOn: boolean;
  }[];
};

const useAlbumListsActions = ({
  albumId, url, initialOnPending, initialOnFavorites, initialOnListened, initialOnUserLists,
}: AlbumListsActionsProps) => {
  const [onPending, setOnPending] = useState(initialOnPending);
  const [onFavorites, setOnFavorites] = useState(initialOnFavorites);
  const [onListened, setOnListened] = useState(initialOnListened);
  const [onUserLists, setOnUserLists] = useState(initialOnUserLists.map(x => ({ ...x, isChanging: false })));
  const { showError } = useErrorAlert();

  const savePending = api.pending.save.useMutation({
    onSuccess: (data) => setOnPending(data),
  });
  const removePending = api.pending.remove.useMutation({
    onSuccess: () => setOnPending(undefined),
  });
  const handlePendingChange = () => {
    if (onPending) {
      setOnPending(undefined);
      removePending.mutate({ id: onPending }, { onError: (err) => { setOnPending(onPending); showError(err.message || "Failed to remove album from pending"); } });
      return;
    }
    setOnPending("pending");
    savePending.mutate({ album: { id: albumId, url } }, { onError: (err) => { setOnPending(undefined); showError(err.message || "Failed to add album to pending"); } });
  };

  const saveFavorites = api.favorites.save.useMutation({
    onSuccess: (data) => setOnFavorites(data),
  });
  const removeFavorites = api.favorites.remove.useMutation({
    onSuccess: () => setOnFavorites(undefined),
  });
  const handleFavoritesChange = (_checked: boolean) => {
    if (onFavorites) {
      setOnFavorites(undefined);
      removeFavorites.mutate({ id: onFavorites }, { onError: (err) => { setOnFavorites(onFavorites); showError(err.message || "Failed to remove album from favorites"); } });
      return;
    }

    setOnFavorites("favorites");
    saveFavorites.mutate({ id: albumId, url }, { onError: (err) => { setOnFavorites(undefined); showError(err.message || "Failed to add album to favorites"); } });
  };

  const saveListened = api.listened.save.useMutation({
    onSuccess: (data) => setOnListened(data),
  });
  const removeListened = api.listened.remove.useMutation({
    onSuccess: () => setOnListened(undefined),
  });
  const handleListenedChange = () => {
    if (onListened) {
      setOnListened(undefined);
      removeListened.mutate({ id: onListened }, { onError: (err) => { setOnListened(onListened); showError(err.message || "Failed to remove album from listened"); } });
      return;
    }

    setOnListened("listened");
    saveListened.mutate({ id: albumId, url }, { onError: (err) => { setOnListened(undefined); showError(err.message || "Failed to add album to listened"); } });
  };

  const saveUserList = api.playlists.save.useMutation({
    onSuccess(_, variables) {
      setOnUserLists((prev) => prev.map((list) => list.playlistId === variables.playlistId ? { ...list, isOn: true } : list));
    },
  });
  const removeUserList = api.playlists.remove.useMutation({
    onSuccess(_, variables) {
      setOnUserLists((prev) => prev.map((list) => list.playlistId === variables.playlistId ? { ...list, isOn: false } : list));
    },
  });
  const handleUserListChange = (playlistId: string) => (checked: boolean) => {
    const userList = onUserLists.find((list) => list.playlistId === playlistId);
    if (!userList) return;

      setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isChanging: true } : list));

    if (checked) {
      setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isOn: true } : list));
      saveUserList.mutate(
        { playlistId, album: { id: albumId, url } },
        { 
          onError: (err) => {
            setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isOn: false } : list));
            showError(err.message || "Failed to add album to playlist");
          },
          onSettled: () => {            
            setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isChanging: false } : list));
          } 
        },
      );
      return;
    }
    setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isOn: false } : list));
    removeUserList.mutate(
      { playlistId, albumId: albumId },
      {
        onError: (err) => {
          setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isOn: true } : list));
          showError(err.message || "Failed to remove album from playlist");
        },
        onSettled: () => {            
          setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isChanging: false } : list));
        } 
      },
    );
  }

  return {
    pending: {
      id: onPending,
      isChanging: savePending.isPending || removePending.isPending,
      change: handlePendingChange,
    },
    favorites: {
      id: onFavorites,
      isChanging: saveFavorites.isPending || removeFavorites.isPending,
      change: handleFavoritesChange,
    },
    listened: {
      id: onListened,
      isChanging: saveListened.isPending || removeListened.isPending,
      change: handleListenedChange,
    },
    userLists: onUserLists.map(x => ({
      playlistId: x.playlistId,
      name: x.name,
      isOn: x.isOn,
      isChanging: x.isChanging,
      change: handleUserListChange(x.playlistId),
    })),
  }
};

const AlbumListsActions = (props: AlbumListsActionsProps) => {
  const {
    pending,
    favorites,
    listened,
    userLists,
  } = useAlbumListsActions(props);

  return (
    <aside className="w-full max-w-sm rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Album lists</h2>
      <div className="space-y-3">

        <AlbumActionCheckbox
          isOn={Boolean(pending.id)}
          isChanging={pending.isChanging}
          change={pending.change}
          label="Pending"
        />
        <AlbumActionCheckbox
          isOn={Boolean(favorites.id)}
          isChanging={favorites.isChanging}
          change={favorites.change}
          label="Favorites"
        />
        <AlbumActionCheckbox
          isOn={Boolean(listened.id)}
          isChanging={listened.isChanging}
          change={listened.change}
          label="Listened"
        />

        {userLists.map((userList) => (
          <AlbumActionCheckbox
            key={userList.playlistId}
            isOn={userList.isOn}
            isChanging={userList.isChanging}
            change={userList.change}
            label={userList.name}
          />
        ))}
      </div>
    </aside>
  );
};

const AlbumActionCheckbox = ({
  isChanging, isOn, change, label,
}: { 
  isChanging: boolean, 
  isOn: boolean, 
  change: (value: boolean) => void, 
  label: string 
}) => {
  return (
    <div className="flex items-center justify-between">
      {isChanging ? (
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
          {label}
        </div>
      ) : (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isOn}
            onChange={(event) => change(event.target.checked)}
          />
          {label}
        </label>
      )}
    </div>
  );
}

export default AlbumListsActions;
