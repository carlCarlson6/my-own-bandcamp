import z from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../infrastructure/trpc";
import { userPlaylistsTable, playlistAlbumsTable, buildPlaylistItemId } from "../playlists/playlists.schema";
import { eq, and } from "drizzle-orm";

export const importFromBandcampMutation = protectedProcedure
  .input(
    z.object({
      username: z.string().min(1),
    }),
  )
  .mutation(async ({ input: { username }, ctx: { userId, db } }) => {
    const fanId = await resolveFanId(username);
    if (fanId === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Could not find Bandcamp user "${username}". Make sure the username is correct.`,
      });
    }

    const [collectionAlbums, wishlistAlbums] = await Promise.all([
      fetchFanItems(fanId, "collection_items"),
      fetchFanItems(fanId, "wishlist_items"),
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

interface BandcampCollectionItem {
  tralbum_type?: string;
  item_type?: string;
  album_id?: number;
  tralbum_url?: string;
  item_url?: string;
  url?: string;
  item_url_path?: string;
  item_id?: string | number;
  tralbum_id?: string | number;
  id?: string | number;
}

interface BandcampCollectionResponse {
  items?: BandcampCollectionItem[];
}

/**
 * Fetch the Bandcamp profile page for the given username and extract the
 * numeric fan_id from the embedded page-data blob. Returns `null` when the
 * user cannot be found or the page structure is unexpected.
 */
export async function resolveFanId(username: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://bandcamp.com/${encodeURIComponent(username)}`,
    );
    if (!response.ok) return null;

    const html = await response.text();

    // Bandcamp embeds a JSON blob in <div id="pagedata" data-blob="...">
    // The attribute value is HTML-entity-encoded JSON.
    const blobMatch =
      /id="pagedata"[^>]*data-blob="([^"]*)"/.exec(html) ??
      /id="pagedata"[^>]*data-blob='([^']*)'/.exec(html);
    if (!blobMatch?.[1]) return null;

    const decoded = blobMatch[1]
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&");

    const blob = JSON.parse(decoded) as { fan_data?: { fan_id?: number } };
    const fanId = blob?.fan_data?.fan_id;

    return typeof fanId === "number" ? fanId : null;
  } catch {
    return null;
  }
}

/**
 * Fetch collection or wishlist items for a Bandcamp fan using the public
 * JSON API. `endpoint` should be `"collection_items"` or `"wishlist_items"`.
 */
export async function fetchFanItems(
  fanId: number,
  endpoint: "collection_items" | "wishlist_items",
): Promise<{ id: string; url: string }[]> {
  try {
    const apiResponse = await fetch(
      `https://bandcamp.com/api/fancollection/1/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fan_id: fanId,
          older_than_token: `${Math.floor(Date.now() / 1000)}::a::`,
          count: 500,
        }),
      },
    );

    if (!apiResponse.ok) return [];

    const data = (await apiResponse.json()) as BandcampCollectionResponse;
    const items = Array.isArray(data.items) ? data.items : [];

    const seen = new Set<string>();
    const candidates = items
      .filter((item) => {
        if (!item) return false;
        // Bandcamp uses single-letter codes in tralbum_type ("a"/"t") and
        // full words in item_type ("album"/"track"). Accept both forms.
        const type = item.tralbum_type ?? item.item_type ?? "";
        return type === "a" || type === "t" || type === "album" || type === "track";
      })
      .map((item) => {
        // Prefer album_id: it always refers to the parent album, even for
        // track purchases, which is what the embedded player needs.
        const albumId = item.album_id ?? item.item_id ?? item.tralbum_id ?? item.id;
        const rawUrl: string | undefined =
          item.tralbum_url ?? item.item_url ?? item.url ?? item.item_url_path;
        const cleanUrl =
          typeof rawUrl === "string" ? rawUrl.split("?")[0] : undefined;
        return {
          id: String(albumId),
          url: cleanUrl ?? "",
        };
      })
      .filter((album) => {
        if (!album.id || album.id === "undefined" || !album.url) return false;
        // De-duplicate by album ID (multiple track purchases from the same
        // album should only appear once).
        if (seen.has(album.id)) return false;
        seen.add(album.id);
        return true;
      });

    // Validate that each album actually exists on Bandcamp before importing.
    const validated = await validateAlbumsExist(candidates);
    return validated;
  } catch {
    return [];
  }
}

/**
 * Check each album URL against Bandcamp. Albums whose URL does not resolve
 * to a valid Bandcamp page (non-2xx response) are dropped.
 * Requests are batched with a concurrency limit to avoid overwhelming
 * the server.
 */
async function validateAlbumsExist(
  albums: { id: string; url: string }[],
): Promise<{ id: string; url: string }[]> {
  const CONCURRENCY = 5;
  const results: { id: string; url: string }[] = [];

  for (let i = 0; i < albums.length; i += CONCURRENCY) {
    const batch = albums.slice(i, i + CONCURRENCY);
    const settled = await Promise.allSettled(
      batch.map(async (album) => {
        const exists = await checkAlbumExists(album.url);
        return exists ? album : null;
      }),
    );
    for (const outcome of settled) {
      if (outcome.status === "fulfilled" && outcome.value) {
        results.push(outcome.value);
      }
    }
  }

  return results;
}

/**
 * Return `true` when the given URL points to a live Bandcamp album page.
 * Uses a HEAD request first (cheap) and falls back to GET when HEAD is
 * not allowed. Returns `false` on any network error, timeout, or non-2xx
 * status.
 */
export async function checkAlbumExists(albumUrl: string): Promise<boolean> {
  try {
    const url = new URL(albumUrl);
    if (url.hostname !== "bandcamp.com" && !url.hostname.endsWith(".bandcamp.com")) return false;

    const signal = AbortSignal.timeout(10_000);
    let response = await fetch(albumUrl, { method: "HEAD", redirect: "follow", signal });
    // Some servers reject HEAD — retry with GET if we get 405.
    if (response.status === 405) {
      response = await fetch(albumUrl, { method: "GET", redirect: "follow", signal });
    }
    return response.ok;
  } catch {
    return false;
  }
}