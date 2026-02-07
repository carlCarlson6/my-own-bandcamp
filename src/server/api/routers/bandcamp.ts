import { load } from "cheerio";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const bandcampUrlRegex =
  /^(?:https?:\/\/)?([a-z0-9-]+)\.bandcamp\.com\/album\/([a-z0-9-]+)\/?$/i;

export const bandcampRouter = createTRPCRouter({
  fetchReleaseData: publicProcedure
    .input(
      z.object({
        url: z
          .string()
          .trim()
          .refine((value) => bandcampUrlRegex.test(value), {
            message: "Invalid Bandcamp album URL",
          }),
      }),
    )
    .query(async ({ input }) => {
      const trimmedUrl = input.url.trim();
      const normalizedUrl = /^(https?:\/\/)/i.test(trimmedUrl)
        ? trimmedUrl
        : `https://${trimmedUrl}`;

      let html = "";

      try {
        const response = await fetch(normalizedUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Album not found",
          });
        }

        html = await response.text();
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Album not found",
        });
      }

      const $ = load(html);

      const jsonLdRaw = $("script[type='application/ld+json']").first().text();
      let jsonLd: unknown = null;

      if (jsonLdRaw) {
        try {
          jsonLd = JSON.parse(jsonLdRaw);
        } catch {
          jsonLd = null;
        }
      }

      const artistName =
        (jsonLd as { byArtist?: { name?: string } } | null)?.byArtist?.name ||
        $("meta[property='og:site_name']").attr("content") ||
        null;

      const releaseName =
        (jsonLd as { name?: string } | null)?.name ||
        $("meta[property='og:title']").attr("content") ||
        null;

      const releaseDate =
        (jsonLd as { datePublished?: string; dateModified?: string } | null)?.datePublished ||
        (jsonLd as { datePublished?: string; dateModified?: string } | null)?.dateModified ||
        $("meta[name='description']").attr("content") ||
        null;

      const releaseId =
        (jsonLd as {
          albumRelease?: { additionalProperty?: { name?: string; value?: number | string }[] }[];
        } | null)?.albumRelease?.[0]?.additionalProperty?.find(
          (prop: { name?: string; value?: number | string }) => prop?.name === "item_id",
        )?.value ?? null;

      const jsonLdImage = (jsonLd as { image?: string | string[] } | null)?.image;
      const albumArtUrl =
        (Array.isArray(jsonLdImage) ? jsonLdImage[0] : jsonLdImage) ||
        $("meta[property='og:image']").attr("content") ||
        null;

      const formatTrackDuration = (value: string | null | undefined) => {
        if (!value) {
          return null;
        }

        const match = value.match(/P(?:\d+Y)?(?:\d+M)?(?:\d+D)?T?(\d+)H(\d+)M(\d+)S/);
        if (match) {
          const hours = Number(match[1] ?? 0);
          const minutes = Number(match[2] ?? 0) + hours * 60;
          const seconds = Number(match[3] ?? 0);
          return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }

        return value;
      };

      const tracklist =
        (jsonLd as {
          track?: {
            itemListElement?: {
              position?: number;
              item?: {
                name?: string;
                duration?: string;
                additionalProperty?: { name?: string; value?: number | string }[];
              };
            }[];
          };
        } | null)?.track?.itemListElement?.map(
          (item: {
            position?: number;
            item?: {
              name?: string;
              duration?: string;
              additionalProperty?: { name?: string; value?: number | string }[];
            };
          }) => {
            const trackId = item?.item?.additionalProperty?.find(
              (prop) => prop?.name === "track_id",
            )?.value;

            return {
              position: item?.position ?? null,
              title: item?.item?.name ?? null,
              duration: formatTrackDuration(item?.item?.duration ?? null),
              trackId: trackId ?? null,
            };
          },
        ) ?? [];

      return {
        html,
        data: {
          artistName,
          releaseName,
          releaseDate,
          releaseId,
          albumArtUrl,
          tracklist,
        },
      };
    }),
});
