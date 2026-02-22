import "~/utils/styles/globals.css";
import "@radix-ui/themes/styles.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { Analytics } from '@vercel/analytics/next';
import { TRPCReactProvider } from "~/utils/trpc/react";

export const metadata: Metadata = {
  title: "My Own Bandcamp",
  description: "Like Bandcamp but with the features I'm lacking",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ClerkProvider>
          <Theme>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </Theme>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
