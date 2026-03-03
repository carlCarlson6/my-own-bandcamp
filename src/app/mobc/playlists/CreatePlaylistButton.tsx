"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/trpc/react";

const CreatePlaylistButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const mutation = api.playlists.create.useMutation({
    onSuccess() {
      setName("");
      setError("");
      setOpen(false);
      router.refresh();
    },
    onError(err) {
      setError(err.message || "Failed to create playlist");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Playlist name cannot be empty");
      return;
    }

    mutation.mutate({ name });
  };

  const handleClose = () => {
    setName("");
    setError("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-cyber-cyan/50 bg-cyber-cyan/10 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/20 hover:shadow-[0_0_10px_var(--color-cyber-cyan)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Create Playlist
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-bg/60 backdrop-blur-md">
          <div className="w-full max-w-md rounded-lg border border-cyber-border bg-cyber-surface p-6 shadow-[0_0_20px_var(--color-cyber-cyan)]">
            <h2 className="mb-4 text-xl font-semibold text-cyber-text">Create New Playlist</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-cyber-muted">
                  Playlist Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g., My Favorites"
                  className="mt-1 w-full rounded-md border border-cyber-border bg-cyber-bg px-3 py-2 text-cyber-text placeholder-cyber-muted focus:border-cyber-cyan focus:shadow-[0_0_8px_var(--color-cyber-cyan)] focus:outline-none"
                  disabled={mutation.isPending}
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-cyber-magenta">{error}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={mutation.isPending || !name.trim()}
                  className="flex-1 rounded-md border border-cyber-cyan/50 bg-cyber-cyan/10 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {mutation.isPending ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="flex-1 rounded-md border border-cyber-border px-4 py-2 text-cyber-muted hover:bg-cyber-border/30 disabled:cursor-not-allowed disabled:opacity-60"
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

export default CreatePlaylistButton;
