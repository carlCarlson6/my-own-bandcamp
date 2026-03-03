"use client";

import { useState } from "react";
import { api } from "~/utils/trpc/react";

type AlbumListsActionsProps = {
  albumId: string;
  url: string;
  initialOnPending: {
    isOn: boolean;
    id?: string;
  };
  initialOnFavorites: {
    isOn: boolean;
    id?: string;
  };
  initialOnListened: {
    isOn: boolean;
    id?: string;
  };
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

  const savePending = api.pending.save.useMutation({
    onSuccess(data) {
      setOnPending({ isOn: Boolean(data), id: data });
    },
  });
  const removePending = api.pending.remove.useMutation({
    onSuccess() {
      setOnPending({ isOn: false, id: undefined });
    },
  });
  const handlePendingChange = (checked: boolean) => {
    if (!checked) {
      setOnPending({ isOn: true, id: undefined });
      savePending.mutate(
        { album: { id: albumId, url } },
        { onError: () => setOnPending({ isOn: false, id: undefined }) },
      );
      return;
    }
    setOnPending({ isOn: false, id: undefined });
    removePending.mutate({ id: albumId }, { onError: () => setOnPending({ isOn: true, id: albumId }) });
  };

  const saveFavorites = api.favorites.save.useMutation({
    onSuccess(data) {
      setOnFavorites({ isOn: Boolean(data), id: data });
    },
  });
  const removeFavorites = api.favorites.remove.useMutation({
    onSuccess() {
      setOnFavorites({ isOn: false, id: undefined });
    },
  });
  const handleFavoritesChange = (checked: boolean) => {
    if (checked) {
      setOnFavorites({ isOn: true, id: undefined });
      saveFavorites.mutate({ id: albumId, url }, { onError: () => setOnFavorites({ isOn: false, id: undefined }) });
      return;
    }
    setOnFavorites({ isOn: false, id: undefined });
    removeFavorites.mutate({ id: albumId }, { onError: () => setOnFavorites({ isOn: true, id: albumId }) });
  };

  const saveListened = api.listened.save.useMutation({
    onSuccess(data) {
      setOnListened({ isOn: Boolean(data), id: data });
    },
  });
  const removeListened = api.listened.remove.useMutation({
    onSuccess() {
      setOnListened({ isOn: false, id: undefined });
    },
  });
  const handleListenedChange = (checked: boolean) => {
    if (checked) {
      setOnListened({ isOn: true, id: undefined });
      saveListened.mutate({ id: albumId, url }, { onError: () => setOnListened({ isOn: false, id: undefined }) });
      return;
    }
    setOnListened({ isOn: false, id: undefined });
    removeListened.mutate({ id: albumId }, { onError: () => setOnListened({ isOn: true, id: albumId }) });
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
          onError: () => {
            setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isOn: false } : list));
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
        onError: () => {
          setOnUserLists((prev) => prev.map((list) => list.playlistId === playlistId ? { ...list, isOn: true } : list));
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
          isOn={pending.isOn.isOn}
          isChanging={pending.isChanging}
          change={pending.change}
          label="Pending"
        />
        <AlbumActionCheckbox
          isOn={favorites.isOn.isOn}
          isChanging={favorites.isChanging}
          change={favorites.change}
          label="Favorites"
        />
        <AlbumActionCheckbox
          isOn={listened.isOn.isOn}
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
