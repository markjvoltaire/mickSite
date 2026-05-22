import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { PostsProvider } from "@/context/PostsContext";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sidewrite — Community threads",
  description:
    "Pick a topic, share a 300-character thought, and slide through the community feed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <PostsProvider>{children}</PostsProvider>
      </body>
    </html>
  );
}
