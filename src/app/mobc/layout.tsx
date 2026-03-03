import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import NavLink from "./NavLink";

export default async function MainUserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return redirect("/");

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-cyber-border bg-cyber-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <a href="/mobc">
            <h1 className="text-2xl font-bold tracking-wider text-cyber-cyan drop-shadow-[0_0_8px_var(--color-cyber-cyan)]">
              My Own Bandcamp
            </h1>
          </a>
          <UserButton />
        </div>
      </header>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl pt-16">
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-cyber-border p-6">
          <nav className="flex flex-col gap-2">
            <NavLink href="/mobc" text="Your albums" />
            <NavLink href="/mobc/search" text="Search albums" />
            <NavLink href="/mobc/pending" text="Pending albums" />
            <NavLink href="/mobc/favorites" text="Favorite albums" />
            <NavLink href="/mobc/listened" text="Listened albums" />
            <NavLink href="/mobc/playlists" text="Your lists" />
          </nav>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col p-8">{children}</main>
      </div>
    </>
  );
}
