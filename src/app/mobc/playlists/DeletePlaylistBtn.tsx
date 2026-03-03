"use client";

import { useRouter } from "next/navigation";
import { api } from "~/utils/trpc/react";

export const DeletePlaylistBtn = ({ playlistId }: { playlistId: string }) => {
  const router = useRouter();
  const deletePlaylist = api.playlists.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this playlist and all its content?")) {
      deletePlaylist.mutate({ playlistId });
    }
  };

  return (
    <button
      type="button"
      className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Delete playlist"
      aria-busy={deletePlaylist.isPending}
      onClick={handleClick}
      disabled={deletePlaylist.isPending}
    >
      {deletePlaylist.isPending ? (
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
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      )}
    </button>
  );
};
