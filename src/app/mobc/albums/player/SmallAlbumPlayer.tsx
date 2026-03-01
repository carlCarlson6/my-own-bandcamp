"use client";

export const SmallAlbumPlayer = ({ albumId }: { albumId: string; }) => {
  return (
    <iframe
      style={{ border: 0, width: '100%', height: 'auto', aspectRatio: '1' }}
      src={`https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/`}
      seamless
    />
  );
};
