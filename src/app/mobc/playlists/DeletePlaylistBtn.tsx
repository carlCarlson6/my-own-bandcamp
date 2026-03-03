"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/trpc/react";

export const DeletePlaylistBtn = ({ playlistId }: { playlistId: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const deletePlaylist = api.playlists.delete.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    deletePlaylist.mutate({ playlistId });
  };

  return (
    <>
      <button
        type="button"
        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Delete playlist"
        onClick={handleOpen}
      >
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
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-playlist-title"
          >
            <h2
              id="delete-playlist-title"
              className="mb-4 text-xl font-semibold"
            >
              Delete Playlist
            </h2>

            <p className="mb-4 text-sm text-gray-600">
              Are you sure you want to delete this playlist and all its content? This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={deletePlaylist.isPending}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletePlaylist.isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={deletePlaylist.isPending}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
