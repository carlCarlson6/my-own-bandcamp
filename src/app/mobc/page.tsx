import { api } from "~/utils/trpc/server";
import AlbumsResumeView from "./albums/AlbumsResumeView";

export default async function MainUserPage() {
  const resume = await api.albums.getResume();
  return (
    <AlbumsResumeView resume={resume} />
  );
}