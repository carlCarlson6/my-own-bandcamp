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

  return {
    albumId: `${pcPageProperties.item_id}`,
    recomendations
  };
}