import Link from "next/link";

type PaginationProps = {
  page: number;
  total: number;
  pageSize: number;
  buildHref: (page: number) => string;
};

export const Pagination = ({ page, total, pageSize, buildHref }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 pt-4" aria-label="Pagination">
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100"
          aria-label="Previous page"
        >
          ← Previous
        </Link>
      ) : (
        <span className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-300 cursor-not-allowed">
          ← Previous
        </span>
      )}

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100"
          aria-label="Next page"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-300 cursor-not-allowed">
          Next →
        </span>
      )}
    </nav>
  );
};
