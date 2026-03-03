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
  // Bandcamp loads collection items client-side; the initial HTML doesn't contain
  // `.collection-item-container` elements. Use the public JSON API instead.
  try {
    // Try to extract the username from the provided URL, e.g. "https://bandcamp.com/<username>"
    const match = url.match(/bandcamp\.com\/([^/?#]+)/);
    const username = match?.[1];

    if (!username) {
      return [];
    }

    const apiResponse = await fetch("https://bandcamp.com/api/fancollection/1/collection_items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // The exact API contract is determined by Bandcamp; here we use the username
      // as the fan identifier and request a reasonable number of items.
      body: JSON.stringify({
        fan_id: username,
        older_than_token: null,
        count: 500,
        sort_by: "date",
      }),
    });

    if (!apiResponse.ok) {
      return [];
    }

    const data: any = await apiResponse.json();
    const items: any[] = Array.isArray(data.items) ? data.items : [];

    return items
      .filter((item) => item && (item.tralbum_type === "a" || item.item_type === "a"))
      .map((item) => {
        // Prefer `tralbum_url` if present; fall back to any URL field that exists.
        const rawUrl: string | undefined =
          item.tralbum_url ?? item.item_url ?? item.url ?? item.item_url_path;
        const cleanUrl = typeof rawUrl === "string" ? rawUrl.split("?")[0] : undefined;

        return {
          id: String(item.item_id ?? item.tralbum_id ?? item.id),
          url: cleanUrl ?? "",
        };
      })
      .filter((album) => album.id && album.url);
  } catch {
    return [];
  }
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
