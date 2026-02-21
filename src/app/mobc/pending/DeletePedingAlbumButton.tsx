"use client";

import { useRouter } from "next/navigation";
import { api } from "~/utils/trpc/react";

const DeletePendingAlbumButton = ({ albumId }: { albumId: string }) => {
  const router = useRouter();
  const mutation = api.removeAlbumFromPending.useMutation({
    onSuccess() {
      router.refresh();
    },
  });

  const handleDelete = () => {
    mutation.mutate({ albumId });
  };

  return (
    <button
      type="button"
      className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Delete album"
      aria-busy={mutation.isPending}
      onClick={handleDelete}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? (
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

export default DeletePendingAlbumButton;