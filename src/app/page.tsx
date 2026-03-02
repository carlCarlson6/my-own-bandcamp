import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) return redirect("/mobc");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">My Own Bandcamp</h1>

      <div className="flex items-center gap-3">
        <SignInButton mode="modal" forceRedirectUrl={"/mobc"}>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
          >
            Sign in
          </button>
        </SignInButton>
      </div>
    </main>
  );
}
