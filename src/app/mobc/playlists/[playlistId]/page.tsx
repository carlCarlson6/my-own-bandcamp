export default async function PlaylistPage({
  params
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;
  

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Playlist Details</h1>
      <p>This page will show the details of a specific playlist.</p>
    </div>
  );
}