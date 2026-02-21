import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@radix-ui/themes";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) return redirect("/mobc");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">My Own Bandcamp</h1>

      <div className="flex items-center gap-3">
          <SignInButton mode="modal" forceRedirectUrl={"/mobc"}>
            <Button size="3">Sign in</Button>
          </SignInButton>
        </div>
    </main>
  );
}
