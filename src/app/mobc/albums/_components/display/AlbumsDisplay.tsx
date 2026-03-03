"use client";

import { useRouter } from "next/navigation";
import GoToAlbumBtn from "../../GoToAlbumBtn";
import { SmallAlbumPlayer } from "../player/SmallAlbumPlayer";
import { api } from "~/utils/trpc/react";

export type Album = {
  id: string;
  bcId: string;
  url: string;  
}

export const AlbumsListDisplay = ({
  albums
} : { 
  albums: Album[]
}) => (
  <div>
    <p className="mb-6 text-sm font-medium text-gray-600">
      {albums.length} album{albums.length !== 1 ? "s" : ""}
    </p>
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {albums.map((album) => (
        <AlbumCard 
          key={album.id} 
          album={album}
        />
      ))}
    </div>
  </div>
);

const AlbumCard = (
  { album }: { album: Album }
) => (
  <div className="overflow-hidden rounded-lg border transition-shadow hover:shadow-2xl">
    <SmallAlbumPlayer albumId={album.bcId} />

    <div className="p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <GoToAlbumBtn albumId={album.bcId} albumUrl={album.url} />
        <DeleteAlbumBtn id={album.id} />
      </div>
    </div>
  </div>
);

const DeleteAlbumBtn = (
  { id }: { id: string }
) => {
  const router = useRouter();
  const { isPending, mutate } = api.favorites.remove.useMutation({
    onSuccess() {
      router.refresh();
    },
  });

  return (
    <button
      type="button"
      className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Delete album"
      aria-busy={isPending}
      onClick={() => mutate({ id })}
      disabled={isPending}
    >
      {isPending ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5 animate-spin"
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
          className="h-5 w-5"
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
}