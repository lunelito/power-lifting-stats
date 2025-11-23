// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import ThemeProvider from "@/src/providers/ThemeProviders";
import Hero from "../components/UI/Hero";
import { Providers } from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Powerlifting Stats - Track Your Progress",
  description: "Track and analyze your powerlifting performance and statistics",
};

// In the future, create a landing page for the entire website that will be accessible before downloading the theme from localhost, so that there is no need for a hacky transition

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 `}
      >
        <Providers>
          <Hero />
          <NavBar />
          <main className="relative z-10 min-h-screen bg-transparent">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
