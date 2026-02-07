"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button, Flex, Spinner, TextField } from "@radix-ui/themes";
import { useMemo, useState } from "react";

import { useReleaseStore } from "~/app/_components/release-store";
import { api } from "~/utils/trpc/react";

export function SearchBar() {
  const [url, setUrl] = useState("");
  const setReleaseData = useReleaseStore((state) => state.setReleaseData);
  const setErrorMessage = useReleaseStore((state) => state.setErrorMessage);


  const isValidBandcampUrl = useMemo(() => {
    const value = url.trim().toLowerCase();
    const regex = /^(?:https?:\/\/)?([a-z0-9-]+)\.bandcamp\.com\/album\/([a-z0-9-]+)\/?$/i;
    return regex.test(value);
  }, [url]);

  const fetchHtmlQuery = api.bandcamp.fetchReleaseData.useQuery(
    { url: url.trim() },
    {
      enabled: false,
      retry: false,
    },
  );

  const handleLookup = async () => {
    if (!isValidBandcampUrl || fetchHtmlQuery.isFetching) {
      return;
    }

    setErrorMessage(null);
    const result = await fetchHtmlQuery.refetch();
    if (result.error) {
      setReleaseData(null);
      setErrorMessage(result.error.message || "Failed to fetch Bandcamp data.");
      return;
    }

    setReleaseData(result.data?.data ?? null);
  };

  return (
    <Flex direction="column" align="center" gap="4" width="100%">
      <Flex align="center" gap="3">
        <TextField.Root
          size="3"
          placeholder="paste a bc album url"
          className="w-105"
          value={url}
          onChange={(event) => setUrl(event.currentTarget.value)}
        />
        <Button
          size="3"
          aria-label="Lookup"
          title="Lookup"
          disabled={!isValidBandcampUrl || fetchHtmlQuery.isFetching}
          onClick={handleLookup}
        >
          {fetchHtmlQuery.isFetching ? (
            <Spinner size="2" />
          ) : (
            <MagnifyingGlassIcon width="16" height="16" />
          )}
        </Button>
      </Flex>

    </Flex>
  );
}
