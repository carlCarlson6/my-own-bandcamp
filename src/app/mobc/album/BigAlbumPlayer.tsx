"use client";

const BigAlbumPlayer = ({albumId} : {albumId: string}) => {
  return (
    <iframe 
      style={{ border: 0, width: 350, height: 786 }} 
      src={`https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/`} 
      seamless
    />
  );
}

export default BigAlbumPlayer;
