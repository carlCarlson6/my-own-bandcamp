const GoToAlbumBtn = ({ albumId }: { albumId: string }) => (
  <a
    href={`/mobc/albums/${albumId}`}
    className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
  >
    Go to album
  </a>
);

export default GoToAlbumBtn;