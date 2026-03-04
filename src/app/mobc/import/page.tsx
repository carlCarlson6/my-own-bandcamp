"use client";

import { useState } from "react";
import { api } from "~/utils/trpc/react";

export default function ImportPage() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<{
    ownedFound: number;
    wishlistedFound: number;
  } | null>(null);

  const { mutate, isPending, error } =
    api.albums.importFromBandcamp.useMutation({
      onSuccess(data) {
        setResult(data);
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length === 0) return;
    setResult(null);
    mutate({ username: username.trim() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Import from Bandcamp</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your Bandcamp username to import your collection and wishlist.
          This will create two lists: <strong>Owned</strong> and{" "}
          <strong>Wishlisted</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <label
            htmlFor="bandcamp-username"
            className="block text-sm font-medium"
          >
            Bandcamp username
          </label>
          <input
            id="bandcamp-username"
            type="text"
            placeholder="your-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full rounded-md border px-4 py-2 outline-none focus:border-blue-500"
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          disabled={isPending || username.trim().length === 0}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Importing…" : "Import"}
        </button>
      </form>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-800">
          Error: {error.message}
        </div>
      )}

      {result && (
        <div className="rounded-md border bg-green-50 p-4 text-green-800">
          <p className="font-semibold">Import complete!</p>
          <ul className="mt-2 list-inside list-disc text-sm">
            <li>
              <strong>Owned</strong>: {result.ownedFound} album
              {result.ownedFound !== 1 ? "s" : ""} found
            </li>
            <li>
              <strong>Wishlisted</strong>: {result.wishlistedFound} album
              {result.wishlistedFound !== 1 ? "s" : ""} found
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
