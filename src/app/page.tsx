import { Flex, Heading } from "@radix-ui/themes";

import { SearchBar } from "~/app/_components/search-bar";

export default async function Home() {
  return (
    <Flex
      align="center"
      justify="start"
      direction="column"
      height="100vh"
      pt="6"
      gap="9"
    >
      <Heading as="h1" size="8">
        MY OWN BANDCAMP
      </Heading>
      <SearchBar />
    </Flex>
  );
}
