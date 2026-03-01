"use client";

const BigAlbumPlayer = ({albumId} : {albumId: string}) => {
  return (
    <iframe 
      style={{ border: 0, borderRadius: 16, width: 520, height: 980 }} 
      src={`https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/`} 
      seamless
    />
  );
}

export default BigAlbumPlayer;
