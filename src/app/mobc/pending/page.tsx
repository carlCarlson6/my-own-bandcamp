import { api } from "~/utils/trpc/server";
import PickRandomPendingAlbumBtn from "./PickRandomAlbumBtn";
import { AlbumsListDisplay } from "../albums/_components/display/AlbumsDisplay";
import { Pagination } from "../_components/Pagination";

export default async function PendingAlbumsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const initialPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  let currentPage = initialPage;
  let { items, total, pageSize } = await api.pending.getAll({ page: currentPage });

  // Handle case where requested page is out of range: total > 0 but no items
  if (total > 0 && items.length === 0 && currentPage > 1) {
    const lastPage = Math.max(1, Math.ceil(total / pageSize));

    if (lastPage !== currentPage) {
      currentPage = lastPage;
      const lastPageResult = await api.pending.getAll({ page: currentPage });
      items = lastPageResult.items;
      total = lastPageResult.total;
      pageSize = lastPageResult.pageSize;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">Pending Albums</h1>
        <PickRandomPendingAlbumBtn />
      </div>
      
      {total === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center text-gray-600">
          No pending albums yet. Start adding albums from the search page!
        </div>
      ) : (
        <>
          <AlbumsListDisplay albums={items} total={total} />
          <Pagination
            page={currentPage}
            total={total}
            pageSize={pageSize}
            buildHref={(p) => `/mobc/pending?page=${p}`}
          />
        </>
      )}
    </div>
  );
}

