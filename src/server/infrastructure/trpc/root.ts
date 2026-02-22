import { createCallerFactory, createTRPCRouter } from "./trpc";
import { pendingRouter } from "~/server/pending/router";
import { favoritesRouter } from "~/server/favorites/router";
import { albumsRouter } from "~/server/albums/router";
import { listenedRouter } from "~/server/listened/router";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pending:    pendingRouter,
  favorites:  favoritesRouter,
  albums:     albumsRouter,
  listened:   listenedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.search({ searchTerm: "example" });
 *       ^? Album[]
 */
export const createCaller = createCallerFactory(appRouter);
