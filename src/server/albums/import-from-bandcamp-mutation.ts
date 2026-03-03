import z from "zod";
import { protectedProcedure } from "../infrastructure/trpc";
import * as cheerio from "cheerio";
import { userPlaylistsTable, playlistAlbumsTable, buildPlaylistItemId } from "../playlists/playlists.schema";
import { eq, and } from "drizzle-orm";

export const importFromBandcampMutation = protectedProcedure
  .input(
    z.object({
      username: z.string().min(1),
    }),
  )
  .mutation(async ({ input: { username }, ctx: { userId, db } }) => {
    const collectionUrl = `https://bandcamp.com/${encodeURIComponent(username)}`;
    const wishlistUrl = `https://bandcamp.com/${encodeURIComponent(username)}/wishlist`;

    const [collectionAlbums, wishlistAlbums] = await Promise.all([
      scrapeCollectionPage(collectionUrl),
      scrapeCollectionPage(wishlistUrl),
    ]);

    const ownedPlaylistId = crypto.randomUUID();
    const wishlistedPlaylistId = crypto.randomUUID();

    const existingOwned = (
      await db
        .select()
        .from(userPlaylistsTable)
        .where(
          and(
            eq(userPlaylistsTable.name, "Owned"),
            eq(userPlaylistsTable.userId, userId),
          ),
        )
        .limit(1)
    ).at(0);

    const existingWishlisted = (
      await db
        .select()
        .from(userPlaylistsTable)
        .where(
          and(
            eq(userPlaylistsTable.name, "Wishlisted"),
            eq(userPlaylistsTable.userId, userId),
          ),
        )
        .limit(1)
    ).at(0);

    const finalOwnedId = existingOwned?.id ?? ownedPlaylistId;
    const finalWishlistedId = existingWishlisted?.id ?? wishlistedPlaylistId;

    if (!existingOwned) {
      await db.insert(userPlaylistsTable).values({
        id: ownedPlaylistId,
        name: "Owned",
        userId,
      });
    }

    if (!existingWishlisted) {
      await db.insert(userPlaylistsTable).values({
        id: wishlistedPlaylistId,
        name: "Wishlisted",
        userId,
      });
    }

    if (collectionAlbums.length > 0) {
      await db
        .insert(playlistAlbumsTable)
        .values(
          collectionAlbums.map((album) => ({
            id: buildPlaylistItemId({
              playlistId: finalOwnedId,
              albumId: album.id,
              userId,
            }),
            playlistId: finalOwnedId,
            albumId: album.id,
            albumUrl: album.url,
            userId,
          })),
        )
        .onConflictDoNothing();
    }

    if (wishlistAlbums.length > 0) {
      await db
        .insert(playlistAlbumsTable)
        .values(
          wishlistAlbums.map((album) => ({
            id: buildPlaylistItemId({
              playlistId: finalWishlistedId,
              albumId: album.id,
              userId,
            }),
            playlistId: finalWishlistedId,
            albumId: album.id,
            albumUrl: album.url,
            userId,
          })),
        )
        .onConflictDoNothing();
    }

    return {
      ownedCount: collectionAlbums.length,
      wishlistedCount: wishlistAlbums.length,
    };
  });

export const scrapeCollectionPage = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  return parseCollectionAlbums(html);
};

export const parseCollectionAlbums = (html: string) => {
  const $ = cheerio.load(html);
  const albums: { id: string; url: string }[] = [];

  $(".collection-item-container").each((_, element) => {
    const $item = $(element);
    const itemId = $item.attr("data-itemid");
    const tralbumType = $item.attr("data-tralbumtype");
    const href = $item.find(".collection-item-title a, .item-link, a.item-link").first().attr("href")
      ?? $item.find("a").first().attr("href");

    if (!itemId || !href || tralbumType !== "a") {
      return;
    }

    const albumUrl = href.split("?").at(0);
    if (!albumUrl) return;

    albums.push({ id: itemId, url: albumUrl });
  });

  return albums;
};
