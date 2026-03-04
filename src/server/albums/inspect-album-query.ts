import z from "zod";
import { publicProcedure } from "../infrastructure/trpc";
import * as cheerio from 'cheerio';

export const inspectAlbumQuery = publicProcedure
  .input(z.object({
      albumUrl: z.string().min(1).url()
  }))
  .query(async ({ input: { albumUrl } }) => {
    const response = await fetch(albumUrl);
    const data = await response.text();
    return inspectAlbum(data);
  });

export const inspectAlbum = (html: string) => {
  const $ = cheerio.load(html);

  const pcPageProperties = z.object({
    item_id: z.number().min(1),
  }).parse(JSON.parse($('meta[name="bc-page-properties"]').attr('content') ?? '{}'));
  
  const recomendations: { 
    id: string;
    url: string;
  }[] = [];
  $('#recommendations_container li.recommended-album').each((_, element) => {
    const $item = $(element);
    const albumId = $item.attr('data-albumid');
    const albumUrl = $item.find('a.album-link').attr('href')?.split('?').at(0);

    if (!albumId || !albumUrl) {
      return;
    }

    recomendations.push({ id: albumId, url: albumUrl });
  });

  console.log(recomendations);

  // Detect if album is on a label page vs artist page.
  // On label pages, the artist link in #name-section points to an absolute URL
  // (e.g. https://artist.bandcamp.com), while on artist pages it's a relative link.
  const artistLinkHref = $('#name-section a').first().attr('href');
  const isLabelPage = !!artistLinkHref && /^https?:\/\//.test(artistLinkHref);

  return {
    albumId: `${pcPageProperties.item_id}`,
    recomendations,
    isLabelPage,
  };
}