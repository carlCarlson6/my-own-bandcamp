const GoToAlbumBtn = (album: { albumId: string, albumUrl: string }) => {
  const encodedData = encodeAlbumData(album);
  return (
    <a
      href={`/mobc/albums/${encodedData}`}
      className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
    >
      Go to album
    </a>
  );
};

export const encodeAlbumData = (album: { albumId: string, albumUrl: string }) => {
  return Buffer.from(JSON.stringify(album), 'utf-8').toString('base64');
}

export default GoToAlbumBtn;