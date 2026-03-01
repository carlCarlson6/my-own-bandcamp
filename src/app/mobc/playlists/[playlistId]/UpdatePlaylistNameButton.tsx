"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/trpc/react";

const UpdatePlaylistNameButton = ({
  playlistId,
  currentName,
}: {
  playlistId: string;
  currentName: string;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");

  const mutation = api.playlists.updateName.useMutation({
    onSuccess() {
      setError("");
      setOpen(false);
      router.refresh();
    },
    onError(err) {
      setError(err.message || "Failed to update playlist name");
    },
  });

  const handleOpen = () => {
    setName(currentName);
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    setName(currentName);
    setError("");
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Playlist name cannot be empty");
      return;
    }

    mutation.mutate({
      playlistId,
      newName: trimmedName,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        Edit Name
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md">
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="update-playlist-name-title"
          >
            <h2
              id="update-playlist-name-title"
              className="mb-4 text-xl font-semibold"
            >
              Update Playlist Name
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newName" className="block text-sm font-medium text-gray-700">
                  Playlist Name
                </label>
                <input
                  id="newName"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  disabled={mutation.isPending}
                  autoFocus
                  maxLength={1000}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={mutation.isPending || !name.trim()}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {mutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePlaylistNameButton;