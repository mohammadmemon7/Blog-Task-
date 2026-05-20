import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PenCraft - Expressive Blogging",
  description: "A gorgeous full-stack blogging platform with user interaction, comments, and sleek interfaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50">
        <Navbar />
        <main className="flex-1 flex flex-col w-full">{children}</main>
        <footer className="w-full border-t border-zinc-200/60 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800/60 dark:text-zinc-400">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} PenCraft. Built with Next.js, Prisma, and Tailwind CSS.</p>
            <p className="font-medium text-zinc-600 dark:text-zinc-300">Hackathon & Intern Project Edition</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
