import Link from "next/link";
import { api } from "~/utils/trpc/server";
import { SmallAlbumPlayer } from "../albums/_components/player/SmallAlbumPlayer";
import CreatePlaylistButton from "./CreatePlaylistButton";

export default async function PlaylistsPage() {
  const resumeInfo = await api.playlists.getResume();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-cyber-text">Your playlists</h2>
          <p className="text-sm text-cyber-muted">
            Click a playlist to open it.
          </p>
        </div>
        <CreatePlaylistButton />
      </div>

      {resumeInfo.length === 0 ? (
        <p className="text-sm text-cyber-muted">No playlists yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {resumeInfo.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/mobc/playlists/${playlist.id}`}
              className="rounded-lg border border-cyber-border bg-cyber-surface p-4 transition-shadow hover:shadow-[0_0_15px_var(--color-cyber-cyan)]"
              prefetch={false}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-cyber-text truncate">{playlist.name}</h3>
                <span className="text-sm text-cyber-muted ml-2 whitespace-nowrap">
                  {playlist.count} {playlist.count === 1 ? "album" : "albums"}
                </span>
              </div>

              {playlist.albums.length === 0 ? (
                <p className="text-sm text-cyber-muted">No albums yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {playlist.albums.map((album) => (
                    <div key={album.id} className="overflow-hidden rounded-md border border-cyber-border">
                      <SmallAlbumPlayer albumId={album.albumId} />
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}