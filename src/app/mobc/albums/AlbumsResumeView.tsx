import Link from "next/link";

import { api } from "~/utils/trpc/server";
import { SmallAlbumPlayer } from "./SmallAlbumPlayer";
import PickRandomPendingAlbumBtn from "../pending/PickRandomAlbumBtn";

const AlumbsResumeView = (
  { resume }: { resume: Awaited<ReturnType<typeof api.albums.getResume>> }
) => {
  const sections = [
    {
      title: "Pending",
      href: "/mobc/pending",
      items: resume.pending,
    },
    {
      title: "Favorites",
      href: "/mobc/favorites",
      items: resume.favorites,
    },
    {
      title: "Listened",
      href: "/mobc/listened",
      items: resume.listened,
    },
  ];

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
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border p-4 transition-shadow hover:shadow-2xl"
            prefetch={false}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <span className="text-sm text-gray-600">
                {section.items.length}
              </span>
            </div>

            {section.items.length === 0 ? (
              <p className="text-sm text-gray-500">No albums yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {section.items.slice(0, 3).map((album) => (
                  <div key={album.id} className="overflow-hidden rounded-md border">
                    <SmallAlbumPlayer albumId={album.id} />
                  </div>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AlumbsResumeView;