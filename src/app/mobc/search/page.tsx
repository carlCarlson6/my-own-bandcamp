"use client";
import { useState, useEffect } from "react";
import { api } from "~/utils/trpc/react";
import { SmallAlbumPlayer } from "../albums/_components/player/SmallAlbumPlayer";
import GoToAlbumBtn, { encodeAlbumData } from "../albums/GoToAlbumBtn";
import { useRouter } from "next/navigation";
import { useErrorAlert } from "../_components/ErrorAlert";

export default function SearchAlbumsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    data: results,
    isLoading,
    error,
  } = api.albums.search.useQuery(
    { searchTerm },
    {
      enabled: searchTerm.length > 0,
    }
  );

  useEffect(() => {
    if (results?.dataOrigin === "from-url") {
      const data = encodeAlbumData({
        albumId: results.album.id,
        albumUrl: results.album.url,
      });
      router.replace(`/mobc/albums/${data}`);
    }
  }, [results, router]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="search" className="block text-sm font-medium">
          Search Albums
        </label>
        <input
          id="search"
          type="text"
          placeholder="Enter album name, artist or paste a bandcamp album URL..."
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

      {results?.dataOrigin === "from-search" && results.albums.length > 0 ? (
        <div>
          <p className="mb-6 text-sm font-medium text-gray-600">
            Found {results.albums.length} result{results.albums.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
            {results.albums.map((album, idx) => (
                <AlbumResultCard 
                  key={idx}
                  album={album}
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

type AlbumSearchResult = {
  id: string;
  url: string;
}

const AlbumResultCard = ({ album }: { album: AlbumSearchResult  }) => { 
  return (
    <div
      className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl"
    >
      <SmallAlbumPlayer albumId={album.id} />
      <div className="p-4">
        <SaveAlbumResultBtn album={album} />
        <GoToAlbumBtn albumId={album.id} albumUrl={album.url} />
      </div>
    </div>
  );
}

const SaveAlbumResultBtn = ({ album: { id, url } }: { album: AlbumSearchResult  }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { showError } = useErrorAlert();
  const { mutate, isPending } = api.pending.save.useMutation({
    onSuccess() {
      setIsSaved(true);
    },
    onError(err) {
      showError(err.message || "Failed to save album. Please try again.");
    },
  });
  const execute = () =>
    mutate({
      album: { id, url },
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