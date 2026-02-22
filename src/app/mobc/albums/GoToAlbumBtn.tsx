const GoToAlbumBtn = ({ albumId, url }: { albumId: string, url: string|undefined }) => (
  <a
    href={`/mobc/albums/${albumId}?albumUrl=${encodeURIComponent(url ?? "")}`}
    className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
  >
    Go to album
  </a>
);

export default GoToAlbumBtn;