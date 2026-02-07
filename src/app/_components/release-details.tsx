import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";

import { type RouterOutputs } from "~/utils/trpc/react";

type ReleaseData = RouterOutputs["bandcamp"]["fetchReleaseData"]["data"];

type ReleaseDetailsProps = {
  data: ReleaseData;
};

const formatReleaseDate = (value: string | null) => {
  if (!value) {
    return "Unknown";
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const match = value.match(/(\d{1,2})\s([A-Za-z]{3,})\s(\d{4})/);
  if (match) {
    const day = match[1]?.padStart(2, "0") ?? match[1] ?? "";
    const month = match[2] ?? "";
    const year = match[3] ?? "";
    return `${day} ${month} ${year}`.trim();
  }

  return value;
};

export function ReleaseDetails({ data }: ReleaseDetailsProps) {
  return (
    <Card size="3" className="w-105">
      <Flex direction="column" gap="3">
        {data.albumArtUrl ? (
          <Box className="overflow-hidden rounded-3">
            <img
              src={data.albumArtUrl}
              alt={data.releaseName ?? "Album art"}
              className="h-auto w-full"
              loading="lazy"
            />
          </Box>
        ) : null}
        <Heading as="h2" size="5">
          {data.releaseName ?? "Unknown release"}
        </Heading>
        <Text size="3">Artist: {data.artistName ?? "Unknown"}</Text>
        <Text size="3">Release date: {formatReleaseDate(data.releaseDate ?? null)}</Text>

        <Box>
          <Heading as="h3" size="4">
            Tracklist
          </Heading>
          {data.tracklist.length ? (
            <Box asChild>
              <ol className="mt-2 space-y-1">
                {data.tracklist.map((track) => (
                  <li key={`${track.position ?? "x"}-${track.trackId ?? "x"}`}>
                    <Text size="2">
                      {track.position ? `${track.position}. ` : ""}
                      {track.title ?? "Untitled"}
                      {track.duration ? ` (${track.duration})` : ""}
                    </Text>
                  </li>
                ))}
              </ol>
            </Box>
          ) : (
            <Text size="2" color="gray">
              No tracks found.
            </Text>
          )}
        </Box>
      </Flex>
    </Card>
  );
}
