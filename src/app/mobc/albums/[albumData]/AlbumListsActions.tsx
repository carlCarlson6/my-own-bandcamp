"use client";

import { useState } from "react";
import { api } from "~/utils/trpc/react";

type AlbumListsActionsProps = {
  id: string;
  url: string;
  initialOnPending: boolean;
  initialOnFavorites: boolean;
  initialOnListened: boolean;
  initialOnUserLists: {
    playlistId: string;
    name: string;
    isOn: boolean;
  }[];
};

const useAlbumListsActions = ({
  id, url, initialOnPending, initialOnFavorites, initialOnListened, initialOnUserLists,
}: AlbumListsActionsProps) => {
  const [onPending, setOnPending] = useState(initialOnPending);
  const [onFavorites, setOnFavorites] = useState(initialOnFavorites);
  const [onListened, setOnListened] = useState(initialOnListened);
  const [onUserLists, setOnUserLists] = useState(initialOnUserLists.map(x => ({ ...x, isChanging: false })));

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

  const handlePendingChange = (checked: boolean) => {
    if (checked) {
      setOnPending(true);
      savePending.mutate(
        { album: { id, url } },
        { onError: () => setOnPending(false) },
      );
      return;
    }
    setOnPending(false);
    removePending.mutate({ albumId: id }, { onError: () => setOnPending(true) });
  };

  const handleFavoritesChange = (checked: boolean) => {
    if (checked) {
      setOnFavorites(true);
      saveFavorites.mutate({ id, url }, { onError: () => setOnFavorites(false) });
      return;
    }
    setOnFavorites(false);
    removeFavorites.mutate({ albumId: id }, { onError: () => setOnFavorites(true) });
  };

  const handleListenedChange = (checked: boolean) => {
    if (checked) {
      setOnListened(true);
      saveListened.mutate({ id, url }, { onError: () => setOnListened(false) });
      return;
    }
    setOnListened(false);
    removeListened.mutate({ albumId: id }, { onError: () => setOnListened(true) });
  };

  const handleUserListChange = (playlistId: string) => (checked: boolean) => {
    const userList = onUserLists.find((list) => list.playlistId === playlistId);
    if (!userList) return;

      setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isChanging: true } : list));

    if (checked) {
      saveUserList.mutate(
        { playlistId, album: { id, url } },
        { 
          onError: () => {
            const list = onUserLists.find((list) => list.playlistId === playlistId);
            if (list) list.isOn = false;
          },
          onSettled: () => {            
            setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isChanging: false } : list));
          } 
        },
      );
      return;
    }
    removeUserList.mutate(
      { playlistId, albumId: id },
      {
        onError: () => {
          const list = onUserLists.find((list) => list.playlistId === playlistId);
          if (list) list.isOn = true;
        },
        onSettled: () => {            
          setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isChanging: false } : list));
        } 
      },
    );
  }

  return {
    pending: {
      isOn: onPending,
      isChanging: savePending.isPending || removePending.isPending,
      change: handlePendingChange,
    },
    favorites: {
      isOn: onFavorites,
      isChanging: saveFavorites.isPending || removeFavorites.isPending,
      change: handleFavoritesChange,
    },
    listened: {
      isOn: onListened,
      isChanging: saveListened.isPending || removeListened.isPending,
      change: handleListenedChange,
    },
    userLists: onUserLists.map(x => ({
      playlistId: x.playlistId,
      name: x.name,
      isOn: x.isOn,
      isChaging: x.isChanging,
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
          isOn={pending.isOn}
          isChanging={pending.isChanging}
          change={pending.change}
          label="Pending"
        />
        <AlbumActionCheckbox
          isOn={favorites.isOn}
          isChanging={favorites.isChanging}
          change={favorites.change}
          label="Favorites"
        />
        <AlbumActionCheckbox
          isOn={listened.isOn}
          isChanging={listened.isChanging}
          change={listened.change}
          label="Listened"
        />

        {userLists.map((userList) => (
          <AlbumActionCheckbox
            key={userList.playlistId}
            isOn={userList.isOn}
            isChanging={userList.isChaging}
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
