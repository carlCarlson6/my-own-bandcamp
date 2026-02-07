"use client";

import { Card, Text } from "@radix-ui/themes";

import { ReleaseDetails } from "~/app/_components/release-details";
import { useReleaseStore } from "~/app/_components/release-store";

export function ReleaseDetailRenderer() {
  const releaseData = useReleaseStore((state) => state.releaseData);
  const errorMessage = useReleaseStore((state) => state.errorMessage);

  if (errorMessage) {
    return (
      <Card size="3" className="w-105">
        <Text size="3" color="red">
          {errorMessage}
        </Text>
      </Card>
    );
  }

  if (!releaseData) {
    return null;
  }

  return <ReleaseDetails data={releaseData} />;
}
