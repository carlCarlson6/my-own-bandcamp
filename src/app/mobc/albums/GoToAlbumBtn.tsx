const GoToAlbumBtn = (album: { albumId: string, albumUrl: string }) => {
  const encodedData = Buffer.from(JSON.stringify(album), 'utf-8').toString('base64');
  return (
    <a
      href={`/mobc/albums/${encodedData}`}
      className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
    >
      Go to album
    </a>
  );
};

export default GoToAlbumBtn;