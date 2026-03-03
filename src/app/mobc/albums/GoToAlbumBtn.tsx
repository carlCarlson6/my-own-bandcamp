const GoToAlbumBtn = (album: { albumId: string, albumUrl: string }) => {
  const encodedData = encodeAlbumData(album);
  return (
    <a
      href={`/mobc/albums/${encodedData}`}
      className="rounded-md border border-cyber-cyan/50 bg-cyber-cyan/10 px-3 py-2 text-sm text-cyber-cyan hover:bg-cyber-cyan/20 hover:shadow-[0_0_10px_var(--color-cyber-cyan)]"
    >
      Go to album
    </a>
  );
};

export const encodeAlbumData = (album: { albumId: string, albumUrl: string }) => {
  return Buffer.from(JSON.stringify(album), 'utf-8').toString('base64');
}

export default GoToAlbumBtn;