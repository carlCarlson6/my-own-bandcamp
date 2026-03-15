# Copilot Project Guide — My Own Bandcamp

> Comprehensive reference for AI assistants and developers working on this codebase.

## Overview

My Own Bandcamp (MOBC) is a full-stack **Next.js 15** web application that lets authenticated users organise, search, and manage Bandcamp music albums. It acts as a personal library manager on top of Bandcamp, providing features such as album discovery, favourites, playlists, and listening-history tracking.

---

## Technology Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 15 | Turbo dev mode enabled |
| UI library | React / React DOM | 19 | Server & Client Components |
| Language | TypeScript | 5.8 | `strict: true` in tsconfig |
| Authentication | Clerk | 6 | OAuth & email sign-in |
| API layer | tRPC | 11 | Type-safe RPC with SuperJSON |
| Database | PostgreSQL | — | Accessed via `postgres` driver (v3) |
| ORM | Drizzle ORM | 0.41 | With `drizzle-kit` for migrations |
| Data fetching | TanStack React Query | 5 | Integrated through tRPC |
| Validation | Zod | 3.24 | Runtime schema validation |
| Pattern matching | ts-pattern | 5.9 | Used for control flow |
| HTML parsing | Cheerio | 1.2 | Bandcamp page scraping |
| Styling | Tailwind CSS | 4 | PostCSS plugin, prettier class sorting |
| Environment validation | @t3-oss/env-nextjs | — | Validates env vars at build time |
| Analytics | Vercel Analytics + Speed Insights | — | Production telemetry |
| Deployment | Vercel | — | — |

---

## Project Structure

```
my-own-bandcamp/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # Root layout (Clerk + tRPC providers, analytics)
│   │   ├── page.tsx                      # Public landing / sign-in page
│   │   ├── api/trpc/[trpc]/route.ts      # tRPC HTTP handler (catch-all route)
│   │   └── mobc/                         # Protected area (requires auth)
│   │       ├── layout.tsx                # Sidebar navigation + sticky header
│   │       ├── page.tsx                  # Dashboard (album summary)
│   │       ├── search/page.tsx           # Album search
│   │       ├── pending/                  # Pending albums + random picker
│   │       ├── favorites/page.tsx        # Favourite albums
│   │       ├── listened/page.tsx         # Listened albums
│   │       ├── albums/[albumData]/       # Album detail with embedded player
│   │       └── playlists/[playlistId]/    # Playlist detail & management
│   │
│   ├── server/                           # Backend logic
│   │   ├── infrastructure/
│   │   │   ├── db/
│   │   │   │   ├── index.ts              # PostgreSQL + Drizzle client (singleton in dev)
│   │   │   │   └── schema.ts             # createTable helper (adds `my-own-bc_` prefix)
│   │   │   └── trpc/
│   │   │       ├── index.ts              # tRPC context, middleware, procedure helpers
│   │   │       └── root.ts              # Root router (merges all domain routers)
│   │   ├── albums/                       # Album domain (search, inspect, resume, lists)
│   │   ├── favorites/                    # Favourites domain
│   │   ├── listened/                     # Listened domain
│   │   ├── pending/                      # Pending domain
│   │   └── playlists/                    # Playlists domain
│   │
│   ├── utils/
│   │   ├── trpc/
│   │   │   ├── react.tsx                 # Client-side tRPC provider & hooks
│   │   │   ├── server.ts                 # Server-side tRPC helpers (RSC)
│   │   │   └── query-client.ts           # React Query client configuration
│   │   └── styles/
│   │       └── globals.css               # Tailwind CSS imports
│   │
│   ├── middleware.ts                     # Clerk authentication middleware
│   └── env.js                            # Runtime environment validation (Zod-based)
│
├── public/                               # Static assets
├── drizzle.config.ts                     # Drizzle ORM configuration
├── next.config.js                        # Next.js configuration
├── tsconfig.json                         # TypeScript configuration
├── eslint.config.js                      # ESLint flat config
├── postcss.config.js                     # PostCSS (Tailwind)
├── prettier.config.js                    # Prettier configuration
├── start-database.sh                     # Docker/Podman PostgreSQL setup script
├── .env.example                          # Environment variable template
└── package.json                          # Dependencies & scripts
```

---

## Architecture & Patterns

### App Router Convention

All pages live under `src/app/`. The public landing page is at `src/app/page.tsx`. Every page inside `src/app/mobc/` is protected by Clerk authentication.

### Data Flow

```
React Server Component
  ↓  calls tRPC server helpers (src/utils/trpc/server.ts)
  ↓  tRPC procedure runs (src/server/<domain>/)
  ↓  Drizzle ORM query executes against PostgreSQL
  ↓  data returned to RSC → rendered as HTML

React Client Component
  ↓  calls tRPC hooks (src/utils/trpc/react.tsx)
  ↓  HTTP batch stream request → tRPC handler (api/trpc/[trpc])
  ↓  tRPC procedure runs → Drizzle ORM → PostgreSQL
  ↓  JSON response → React Query cache → re-render
```

- **Server Components** fetch data via `api.someRouter.someQuery()` using the tRPC server caller (hydration helpers from `createHydrationHelpers`).
- **Client Components** use `api.someRouter.someQuery.useQuery()` and `api.someRouter.someMutation.useMutation()` hooks backed by TanStack React Query.
- **SuperJSON** is the transformer, so Date, Map, Set, and other non-JSON types serialise correctly.

### tRPC Setup

| File | Purpose |
|---|---|
| `src/server/infrastructure/trpc/index.ts` | Creates `TRPCContext` (db, userId, headers), defines `publicProcedure` and `protectedProcedure`, configures SuperJSON & Zod error flattening |
| `src/server/infrastructure/trpc/root.ts` | Merges all domain routers into `appRouter`; exports the `AppRouter` type |
| `src/app/api/trpc/[trpc]/route.ts` | Next.js route handler that bridges HTTP to tRPC |
| `src/utils/trpc/react.tsx` | `TRPCReactProvider` wrapping QueryClient + httpBatchStreamLink |
| `src/utils/trpc/server.ts` | Server-side caller + hydration helpers for RSC pre-fetching |
| `src/utils/trpc/query-client.ts` | Shared QueryClient factory (singleton in browser, new per request on server) |

**Procedures:**

- `publicProcedure` — no auth required.
- `protectedProcedure` — requires Clerk auth; extracts `userId` from the Clerk session via `auth()` and attaches it to context. Throws `UNAUTHORIZED` if missing.

### Authentication (Clerk)

- **Middleware** (`src/middleware.ts`): `clerkMiddleware()` protects all matched routes.
- **Route matcher**: covers `/api/trpc(.*)` and non-static pages.
- **Root layout** wraps the app with `<ClerkProvider>`.
- **Protected layout** (`src/app/mobc/layout.tsx`) renders `<UserButton>` from Clerk.
- **Server-side**: `protectedProcedure` calls `auth()` to get the current user id.
- **Environment variables**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (client), `CLERK_SECRET_KEY` (server).

### Database (Drizzle ORM + PostgreSQL)

- **Connection**: `src/server/infrastructure/db/index.ts` — uses `postgres` driver with a singleton pattern in development to survive HMR.
- **Table prefix**: All tables use `my-own-bc_` prefix via the `createTable` helper in `schema.ts`.
- **Multi-tenant isolation**: Every table includes a `userId` column. Queries always filter by `eq(table.userId, userId)`.
- **Composite IDs**: Records use `${albumId}-${userId}` as the primary key to enforce uniqueness per user.
- **Indexes**: `userId` columns are indexed for performance.
- **Cascade deletes**: Playlist albums reference the playlist table with `onDelete: "cascade"`.

**Tables:**

| Table | Purpose |
|---|---|
| `my-own-bc_pending_albums` | Albums queued for later listening |
| `my-own-bc_favorites_albums` | User's favourite albums |
| `my-own-bc_listened_albums` | Albums already listened to |
| `my-own-bc_user_playlists` | User-created playlists (name, metadata) |
| `my-own-bc_playlist_albums` | Albums belonging to a playlist (FK → playlists, cascade) |

### Domain Module Pattern

Each domain (albums, favourites, listened, pending, playlists) follows a consistent structure:

```
src/server/<domain>/
├── <domain>.schema.ts            # Drizzle table definition
├── get-<something>-query.ts      # Read procedure(s)
├── <action>-<domain>-mutation.ts # Write procedure(s)
└── router.ts                     # tRPC router merging queries + mutations
```

**Naming conventions:**
- Queries: `get-*-query.ts`
- Mutations: `<verb>-*-mutation.ts` (e.g. `save-pending-mutation.ts`, `remove-favorite-mutation.ts`)
- Schemas: `<domain>.schema.ts`
- Routers: `router.ts`

### Bandcamp Integration

Album data is scraped from Bandcamp using **Cheerio** (HTML parsing). The `inspect` and `search` queries in `src/server/albums/` handle:
- Accepting a direct Bandcamp URL or a text search term.
- Scraping album metadata (title, artist, cover art, embed URL).
- Extracting related/recommended albums from the page.

### UI Patterns

- **Server Components** are default; add `"use client"` only when interactivity (state, effects, event handlers) is needed.
- **Tailwind CSS** for all styling; class names are auto-sorted by the Prettier plugin.
- **Embedded Bandcamp players** use iframes (`SmallAlbumPlayer` for cards, `BigAlbumPlayer` for detail view).
- **Clickable cards**: On the playlists list page (`/mobc/playlists`), the entire playlist card (title + album previews) is wrapped in a `<Link>` so the whole card is clickable and navigates to the playlist detail page. The `DeletePlaylistBtn` inside uses `e.stopPropagation()` to prevent navigation when deleting.
- **Layouts**: `src/app/mobc/layout.tsx` provides a sticky header with `<UserButton>` and a sidebar with navigation links.
- **Max width** container set to `6xl` for responsive design.

---

## Development Workflow

### Environment Setup

1. Copy `.env.example` → `.env` and fill in values.
2. Start PostgreSQL:
   ```bash
   ./start-database.sh
   ```
3. Push the schema to the database:
   ```bash
   npm run db:push
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

### Required Environment Variables

| Variable | Scope | Purpose |
|---|---|---|
| `DATABASE_URL` | Server | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | Clerk public key |
| `CLERK_SECRET_KEY` | Server | Clerk secret key |
| `NODE_ENV` | Both | `development`, `production`, or `test` |

### NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `next dev --turbo` | Start dev server with Turbo |
| `npm run build` | `next build` | Production build |
| `npm run start` | `next start` | Serve production build |
| `npm run check` | `next lint && tsc --noEmit` | Lint + type-check (no emit) |
| `npm run lint` | `next lint` | Run ESLint |
| `npm run lint:fix` | `next lint --fix` | Auto-fix lint issues |
| `npm run format:check` | `prettier --check .` | Check formatting |
| `npm run format:write` | `prettier --write .` | Auto-format all files |
| `npm run db:generate` | `drizzle-kit generate` | Generate migration files |
| `npm run db:push` | `drizzle-kit push` | Push schema directly to DB |
| `npm run db:migrate` | `drizzle-kit migrate` | Run pending migrations |
| `npm run db:studio` | `drizzle-kit studio` | Open Drizzle Studio GUI |

### Linting & Formatting

- **ESLint 9** flat config with TypeScript-ESLint and Next.js plugins.
- **Drizzle ESLint plugin** enforces `delete` and `update` statements always include a `WHERE` clause.
- **Prettier** with `prettier-plugin-tailwindcss` for automatic Tailwind class sorting.
- Run `npm run check` to lint and type-check in one step.

### Testing

There is no test framework configured in the project. Validation is done via TypeScript type-checking (`tsc --noEmit`) and ESLint.

---

## Coding Conventions

### TypeScript

- **Strict mode** enabled (`strict: true` in tsconfig).
- Prefer type inference from tRPC procedures and Drizzle queries over manual type annotations.
- Use **Zod schemas** for all runtime input validation in tRPC procedures.
- Use **ts-pattern** (`match`/`P`) for exhaustive pattern matching where appropriate.

### File & Naming

- **PascalCase** for React component files and exports.
- **kebab-case** for non-component files (queries, mutations, schemas, routers).
- Route directories match the URL path (e.g. `src/app/mobc/search/page.tsx` → `/mobc/search`).
- One tRPC procedure per file for queries and mutations.

### Database

- Always scope queries with `eq(table.userId, ctx.userId)` — never return data across users.
- Use the `createTable` helper from `src/server/infrastructure/db/schema.ts` to ensure the `my-own-bc_` prefix.
- Add indexes on `userId` for every new table.
- Use `onDelete: "cascade"` for child relationships (e.g. playlist albums).

### React

- Default to **Server Components**; add `"use client"` only when strictly necessary.
- Data fetching in Server Components uses the tRPC server caller.
- Mutations and interactive state use Client Components with tRPC React hooks.
- After a mutation, invalidate related queries via `utils.<router>.<query>.invalidate()`.

---

## How To Perform Common Tasks

### Add a New Domain/Feature

1. Create a new directory under `src/server/<domain>/`.
2. Define the Drizzle table in `<domain>.schema.ts` using `createTable`.
3. Write query files (`get-*-query.ts`) and mutation files (`<verb>-*-mutation.ts`).
4. Create `router.ts` merging queries and mutations into a tRPC router.
5. Register the new router in `src/server/infrastructure/trpc/root.ts`.
6. Push the schema: `npm run db:push`.
7. Create UI pages under `src/app/mobc/<feature>/page.tsx`.

### Add a New tRPC Procedure

1. Create a file in the appropriate `src/server/<domain>/` directory.
2. Use `protectedProcedure` (for authenticated endpoints) or `publicProcedure`.
3. Define input validation with `.input(z.object({ ... }))`.
4. Implement the logic in `.query(...)` or `.mutation(...)`.
5. Add the procedure to the domain's `router.ts`.

### Add a New Database Table

1. Define the table in `src/server/<domain>/<domain>.schema.ts` using `createTable`.
2. Include `userId` column and an index on it.
3. Use composite IDs (`${entityId}-${userId}`) for user isolation.
4. Run `npm run db:push` to update the database schema.

### Add a New Page

1. Create `src/app/mobc/<route>/page.tsx`.
2. For server-side data, call tRPC server helpers and use `<HydrateClient>`.
3. For client-side interactivity, create a separate `"use client"` component.
4. Add navigation links in `src/app/mobc/layout.tsx` if needed.
