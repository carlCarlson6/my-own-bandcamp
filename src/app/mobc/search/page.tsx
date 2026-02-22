"use client";

import { useState } from "react";
import { api } from "~/utils/trpc/react";
import { SmallAlbumPlayer } from "../album/SmallAlbumPlayer";

export default function SearchAlbumsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: results,
    isLoading,
    error,
  } = api.searchAlbums.useQuery(
    { searchTerm },
    {
      enabled: searchTerm.length > 0,
    }
  );

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="search" className="block text-sm font-medium">
          Search Albums
        </label>
        <input
          id="search"
          type="text"
          placeholder="Enter album name or artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2 w-full rounded-md border px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-800">
          Error: {error.message}
        </div>
      )}

      {isLoading && searchTerm.length > 0 && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

      {results && results.length > 0 ? (
        <div>
          <p className="mb-6 text-sm font-medium text-gray-600">
            Found {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
            {results.map((album, idx) => (
                <AlbumResultCard 
                  key={idx}
                  albumId={album.id}
                />
            ))}
          </div>
        </div>
      ) : (
        searchTerm.length > 0 &&
        !isLoading && (
          <div className="text-center text-gray-500">No albums found.</div>
        )
      )}
    </div>
  );
}

const AlbumResultCard = ({ albumId }: { albumId: string}) => { 
  return (
    <div
      className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl"
    >
      <SmallAlbumPlayer albumId={albumId} />
      <div className="p-4">
        <SaveAlbumResultBtn albumId={albumId} />
        <a href={`/mobc/album/${albumId}`} className="mt-3 inline-block rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
          Go to album
        </a>
      </div>
    </div>
  );
}

const SaveAlbumResultBtn = ({ albumId }: { albumId : string }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { mutate, isPending } = api.saveAlbumToPending.useMutation({
    onSuccess() {
      setIsSaved(true);
    },
    onError() {
      alert("Failed to save album. Please try again.");
    }
  });
  const execute = () =>
    mutate({
      album: {
        id: albumId
      },
    });
  
  return (
    <button
      className="mt-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={isSaved ? "Album saved" : "Add album to pending list"}
      aria-busy={isPending}
      onClick={execute}
      disabled={isPending || isSaved}
    >
      {isPending ? (
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
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      )}
      {isSaved ? "Saved" : "Add to pending"}
    </button>
  );
}