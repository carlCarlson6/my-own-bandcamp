import { Flex, Heading } from "@radix-ui/themes";

import { ReleaseDetailRenderer } from "~/app/_components/release-detail-renderer";
import { SearchBar } from "~/app/_components/search-bar";

export default async function Home() {
  return (
    <Flex
      align="center"
      justify="start"
      direction="column"
      minHeight="100vh"
      pt="6"
      pb="6"
      gap="9"
      className="overflow-y-auto"
    >
      <Heading as="h1" size="8">
        MY OWN BANDCAMP
      </Heading>
      <SearchBar />
      <ReleaseDetailRenderer />
    </Flex>
  );
}
