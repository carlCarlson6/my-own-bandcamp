"use client";

export const SmallAlbumPlayer = ({ albumId }: { albumId: string; }) => {
  return (
    <iframe
      style={{ border: 0, width: '100%', height: 'auto', aspectRatio: '1' }}
      src={`https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=0a0a1a/linkcol=00f0ff/minimal=true/transparent=true/`}
      seamless
    />
  );
};
