"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button, Flex, TextField } from "@radix-ui/themes";
import { useMemo, useState } from "react";

export function SearchBar() {
  const [url, setUrl] = useState("");

  const isValidBandcampUrl = useMemo(() => {
    const value = url.trim().toLowerCase();
    const regex = /^https?:\/\/([a-z0-9-]+)\.bandcamp\.com\/album\/([a-z0-9-]+)\/?$/i;
    return regex.test(value);
  }, [url]);

  return (
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
        disabled={!isValidBandcampUrl}
      >
        <MagnifyingGlassIcon width="16" height="16" />
      </Button>
    </Flex>
  );
}
