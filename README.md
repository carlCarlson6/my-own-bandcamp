# My Own Bandcamp

A personal music album management web app inspired by Bandcamp — built to add the features Bandcamp lacks.

## Features

- **Dashboard** — Overview of all your album lists with album counts and cover previews.
- **Search** — Search for albums by name or artist, or paste a Bandcamp album URL directly to import it.
- **Pending** — Queue albums you want to listen to. Use the "Pick Random Album" button to let the app choose one for you.
- **Favorites** — Save and browse your favorite albums in a dedicated list.
- **Listened** — Keep track of albums you have already listened to.
- **Playlists** — Create and manage custom playlists, add or remove albums, and rename them at any time.
- **Album Player** — Embedded Bandcamp player available in both small (card) and full-size (detail) variants.
- **Authentication** — Secure sign-in via Clerk; all routes are protected and scoped to the authenticated user.

## Architecture

The application is a full-stack Next.js app using the **App Router**:

```
src/
├── app/                     # Next.js App Router pages and layouts
│   ├── page.tsx             # Public landing / sign-in page
│   └── mobc/                # Protected area (requires authentication)
│       ├── layout.tsx       # Shared sidebar navigation + header
│       ├── page.tsx         # Dashboard (album summary)
│       ├── search/          # Album search page
│       ├── pending/         # Pending albums list
│       ├── favorites/       # Favorite albums list
│       ├── listened/        # Listened albums list
│       ├── playlists/       # Playlists management
│       └── albums/          # Album detail + embedded player
└── server/                  # Backend logic (tRPC routers + DB access)
    ├── albums/              # Album queries (search, inspect, resume, lists)
    ├── favorites/           # Favorites mutations & queries
    ├── listened/            # Listened mutations & queries
    ├── pending/             # Pending mutations & queries
    ├── playlists/           # Playlist mutations & queries
    └── infrastructure/
        ├── db/              # Drizzle ORM client & schema
        └── trpc/            # tRPC initialisation & context
```

**Data flow**: React Server Components fetch data directly through tRPC server helpers. Client components use tRPC + TanStack Query for mutations and reactive queries. All database access goes through Drizzle ORM against a PostgreSQL database.

## Technologies

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, React 19) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Authentication | [Clerk](https://clerk.com) |
| API | [tRPC v11](https://trpc.io) |
| Database | [PostgreSQL](https://www.postgresql.org) + [Drizzle ORM](https://orm.drizzle.team) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [Radix UI Themes](https://www.radix-ui.com/themes) |
| Data fetching | [TanStack React Query](https://tanstack.com/query) (via tRPC) |
| Validation | [Zod](https://zod.dev) |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights) |
| Deployment | [Vercel](https://vercel.com) |

## Getting Started

1. Copy `.env.example` to `.env` and fill in the required environment variables (Clerk keys, database URL).
2. Start a local PostgreSQL instance:
   ```bash
   ./start-database.sh
   ```
3. Run database migrations:
   ```bash
   npm run db:push
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.
