import { searchAlbumsQuery } from "~/server/search/search-albums-query";
import { createCallerFactory, createTRPCRouter } from "./trpc";
import { saveToPendingMutation } from "~/server/pending/save-to-pending-mutation";
import { getPendingAlbumsQuery } from "~/server/pending/get-pending-albums-query";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  searchAlbums: searchAlbumsQuery,
  saveAlbumToPending: saveToPendingMutation,
  getPendingAlbums: getPendingAlbumsQuery,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.searchAlbums({ searchTerm: "example" });
 *       ^? Album[]
 */
export const createCaller = createCallerFactory(appRouter);
