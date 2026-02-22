import z from "zod";
import { publicProcedure } from "../infrastructure/trpc/trpc";
import * as cheerio from 'cheerio';

export const searchAlbumsQuery = publicProcedure
  .input(z.object({
    searchTerm: z.string().min(1),
  }))
  .query(async ({ input: { searchTerm } }) => {
    const response = await fetch(`https://bandcamp.com/search?q=${searchTerm}&item_type=a&from=results`); // TODO - move this to env variables and create proper service to call bandcamp API
    const data = await response.text();
    return parseAlbumsFromHTML(data);
  });

const parseAlbumsFromHTML = (html: string) => {
  console.log('============== Parsing albums from HTML ==============');
  const $ = cheerio.load(html);

  const searchResults: { id: string; url: string }[] = [];

  $('ul.result-items li.searchresult').each((_, element) => {
    const $item = $(element);
    const searchData = z.object({
      id: z.number().min(1),
    }).parse(JSON.parse($item.attr('data-search') ?? '{}'));
    const id = searchData.id;

    const albumUrl = z
      .string()
      .url()
      .nullable()
      .parse($item.find('a.artcont').attr('href'))?.split('?').at(0);
  
    if (!id || !albumUrl) {
      return;
    }

    searchResults.push({ id: `${id}`, url: albumUrl });
  });
  
  return searchResults;
}