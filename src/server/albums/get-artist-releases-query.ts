import z from "zod";
import { publicProcedure } from "../infrastructure/trpc";
import * as cheerio from "cheerio";

export const getArtistReleasesQuery = publicProcedure
  .input(
    z.object({
      albumUrl: z.string().min(1).url(),
    }),
  )
  .query(async ({ input: { albumUrl } }) => {
    const artistBaseUrl = new URL(albumUrl).origin;
    const musicPageUrl = `${artistBaseUrl}/music`;
    const response = await fetch(musicPageUrl);
    if (!response.ok) {
      return [];
    }
    const html = await response.text();
    return parseArtistReleases(html, albumUrl);
  });

export const parseArtistReleases = (html: string, currentAlbumUrl: string) => {
  const $ = cheerio.load(html);

  const releases: { id: string; url: string }[] = [];
  const currentPath = new URL(currentAlbumUrl).pathname;
  const artistOrigin = new URL(currentAlbumUrl).origin;

  $("#music-grid li, ol.music-grid li").each((_, element) => {
    const $item = $(element);
    const dataItemId = $item.attr("data-item-id");
    const href = $item.find("a").first().attr("href");

    if (!dataItemId || !href) {
      return;
    }

    // Only include albums, skip tracks and other item types
    if (!dataItemId.startsWith("album-")) {
      return;
    }

    const albumId = dataItemId.replace(/^album-/, "");
    const albumPath = href.split("?").at(0);

    if (!albumId || !albumPath || albumPath === currentPath) {
      return;
    }

    const fullUrl = albumPath.startsWith("http")
      ? albumPath
      : `${artistOrigin}${albumPath}`;

    releases.push({ id: albumId, url: fullUrl });
  });

  return releases;
};
