import { api } from "~/utils/trpc/server";
import Link from "next/link";
import PickRandomPendingAlbumBtn from "./pending/PickRandomAlbumBtn";
import { SmallAlbumPlayer } from "./albums/player/SmallAlbumPlayer";

const DisplayUserLists = async () => {
  const resume = await api.albums.getResume();
  return (
    <>
    {resume.map((x) => (
      <Link
        key={x.href}
        href={x.href}
        className="rounded-lg border p-4 transition-shadow hover:shadow-2xl"
        prefetch={false}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{x.title}</h3>
          <span className="text-sm text-gray-600">
            {x.count} {x.count === 1 ? "album" : "albums"}
          </span>
        </div>

        {x.albums.length === 0 ? (
          <p className="text-sm text-gray-500">No albums yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {x.albums.map((album) => (
              <div key={album.id} className="overflow-hidden rounded-md border">
                <SmallAlbumPlayer albumId={album.id} />
              </div>
            ))}
          </div>
        )}
      </Link>
    ))}
    </>
  );
}

export default async function MainUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Your albums</h2>
          <p className="text-sm text-gray-600">
            Quick view of your lists. Click a section to open it.
          </p>
        </div>
        <PickRandomPendingAlbumBtn />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <DisplayUserLists />
      </div>
    </div>
  );
}