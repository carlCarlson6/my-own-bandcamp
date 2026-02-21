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
      <header className="fixed top-0 right-0 left-0 z-50 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <h1 className="text-2xl font-bold">My Own Bandcamp</h1>
          <UserButton />
        </div>
      </header>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl pt-16">
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r p-6">
          <nav className="flex flex-col gap-2">
            <NavLink href="/mobc/search" text="Search albums" />
            <NavLink href="/mobc/pending" text="Pending albums" />
            <NavLink href="/mobc/favorites" text="Favorite albums" />
            <NavLink href="/mobc/listened" text="Listened albums" />
          </nav>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col p-8">{children}</main>
      </div>
    </>
  );
}
